!include "LogicLib.nsh"
!include "nsDialogs.nsh"
!include "nsProcess.nsh"

!macro customWelcomePage
XPStyle on

Var AlreadyAlerted
Var IsSSDCoinProcessRunning
Var RemainingProcesses

Page custom checkIsSSDCoinRunning checkIsSSDCoinRunningLeave

;https://nsis.sourceforge.io/StrTok_function
;author bigmac666
Function StrTok
  Exch $R1
  Exch 1
  Exch $R0
  Push $R2
  Push $R3
  Push $R4
  Push $R5

  ;R0 fullstring
  ;R1 tokens
  ;R2 len of fullstring
  ;R3 len of tokens
  ;R4 char from string
  ;R5 testchar

  StrLen $R2 $R0
  IntOp $R2 $R2 + 1

  loop1:
    IntOp $R2 $R2 - 1
    IntCmp $R2 0 exit

    StrCpy $R4 $R0 1 -$R2

    StrLen $R3 $R1
    IntOp $R3 $R3 + 1

    loop2:
      IntOp $R3 $R3 - 1
      IntCmp $R3 0 loop1

      StrCpy $R5 $R1 1 -$R3

      StrCmp $R4 $R5 Found
    Goto loop2
  Goto loop1

  exit:
  ;Not found!!!
  StrCpy $R1 ""
  StrCpy $R0 ""
  Goto Cleanup

  Found:
  StrLen $R3 $R0
  IntOp $R3 $R3 - $R2
  StrCpy $R1 $R0 $R3

  IntOp $R2 $R2 - 1
  IntOp $R3 $R3 + 1
  StrCpy $R0 $R0 $R2 $R3

  Cleanup:
  Pop $R5
  Pop $R4
  Pop $R3
  Pop $R2
  Exch $R0
  Exch 1
  Exch $R1

FunctionEnd

Function checkIsSSDCoinRunning
  StrCpy $AlreadyAlerted 0
  loop:
    ClearErrors
    ; Check if the main SSDCoin.exe process is running
    ${nsProcess::FindProcess} "ssdcoin.exe" $IsSSDCoinProcessRunning
    ${If} $IsSSDCoinProcessRunning == 0
      ${If} $AlreadyAlerted == 0
        StrCpy $AlreadyAlerted 1
        MessageBox MB_OKCANCEL|MB_ICONEXCLAMATION "Installation cannot continue while SSDCoin is still running. Please exit the SSDCoin application and then click OK to proceed." IDOK retry IDCANCEL exit
      ${Else}
        MessageBox MB_OKCANCEL|MB_ICONEXCLAMATION "SSDCoin is still running. Please exit the SSDCoin application and then click OK to proceed." IDOK retry IDCANCEL exit
      ${EndIf}
    ${EndIf}

    StrCpy $R0 "ssdcoin_daemon.exe ssdcoin_data_layer.exe ssdcoin_data_layer_http.exe ssdcoin_farmer.exe ssdcoin_full_node.exe ssdcoin_harvester.exe ssdcoin_wallet.exe"
    StrCpy $R3 "" ; Accumulator for the names of all running processes
  processLoop:
    ClearErrors
    StrCpy $RemainingProcesses $R0

    ; Get the next process name from the string
    StrCpy $R1 " " ; Delimiter for StrTok
    Push $R0
    Push $R1
    Call StrTok
    Pop $R1 ; $R1 will have the next process name
    Pop $R0 ; $R0 will have the remaining processes to check

    ${If} $R1 == ""
    ${AndIf} $R0 == ""
      StrCpy $R1 $RemainingProcesses
    ${EndIf}

    ${If} $R1 == ""
      ; If no more process names, end the loop
      Goto endLoop
    ${EndIf}
    ; Check if the process is running
    ${nsProcess::FindProcess} $R1 $R2
    ${If} $R2 == 0
      ; If the process is running, add its name to $R3
      StrCpy $R3 "$R3$R1 "
    ${EndIf}
    Goto processLoop
  endLoop:
    ; If any processes are running, show a message box with their names
    ${If} $R3 != ""
      MessageBox MB_OKCANCEL|MB_ICONEXCLAMATION "The following SSDCoin processes are still running. Please stop all SSDCoin services and then click OK to proceed.$\n$\nRunning processes:$\n$R3" IDOK retry IDCANCEL exit
    ${Else}
      Goto done
    ${EndIf}
  retry:
    Goto loop
  exit:
    Quit
  done:
    Return
FunctionEnd


Function checkIsSSDCoinRunningLeave
  ${nsProcess::FindProcess} "ssdcoin.exe" $R0
  Pop $0
FunctionEnd
!macroend ; customWelcomePage


; Add our customizations to the finish page
!macro customFinishPage
XPStyle on

Var DetectDlg
Var FinishDlg
Var SSDCoinSquirrelInstallLocation
Var SSDCoinSquirrelInstallVersion
Var SSDCoinSquirrelUninstaller
Var CheckboxUninstall
Var CheckboxLaunchOnExit
Var CheckboxAddToPath
Var LaunchOnExit
Var AddToPath
Var UninstallSSDCoinSquirrelInstall
Var BackButton
Var NextButton

Page custom detectOldSSDCoinVersion detectOldSSDCoinVersionPageLeave
Page custom finish finishLeave

; Add a page offering to uninstall an older build installed into the ssdcoin-blockchain dir
Function detectOldSSDCoinVersion
  ; Check the registry for old ssdcoin-blockchain installer keys
  ReadRegStr $SSDCoinSquirrelInstallLocation HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\ssdcoin-blockchain" "InstallLocation"
  ReadRegStr $SSDCoinSquirrelInstallVersion HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\ssdcoin-blockchain" "DisplayVersion"
  ReadRegStr $SSDCoinSquirrelUninstaller HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\ssdcoin-blockchain" "QuietUninstallString"

  StrCpy $UninstallSSDCoinSquirrelInstall ${BST_UNCHECKED} ; Initialize to unchecked so that a silent install skips uninstalling

  ; If registry keys aren't found, skip (Abort) this page and move forward
  ${If} SSDCoinSquirrelInstallVersion == error
  ${OrIf} SSDCoinSquirrelInstallLocation == error
  ${OrIf} $SSDCoinSquirrelUninstaller == error
  ${OrIf} $SSDCoinSquirrelInstallVersion == ""
  ${OrIf} $SSDCoinSquirrelInstallLocation == ""
  ${OrIf} $SSDCoinSquirrelUninstaller == ""
  ${OrIf} ${Silent}
    Abort
  ${EndIf}

  ; Check the uninstall checkbox by default
  StrCpy $UninstallSSDCoinSquirrelInstall ${BST_CHECKED}

  ; Magic create dialog incantation
  nsDialogs::Create 1018
  Pop $DetectDlg

  ${If} $DetectDlg == error
    Abort
  ${EndIf}

  !insertmacro MUI_HEADER_TEXT "Uninstall Old Version" "Would you like to uninstall the old version of SSDCoin Blockchain?"

  ${NSD_CreateLabel} 0 35 100% 12u "Found SSDCoin Blockchain $SSDCoinSquirrelInstallVersion installed in an old location:"
  ${NSD_CreateLabel} 12 57 100% 12u "$SSDCoinSquirrelInstallLocation"

  ${NSD_CreateCheckBox} 12 81 100% 12u "Uninstall SSDCoin Blockchain $SSDCoinSquirrelInstallVersion"
  Pop $CheckboxUninstall
  ${NSD_SetState} $CheckboxUninstall $UninstallSSDCoinSquirrelInstall
  ${NSD_OnClick} $CheckboxUninstall SetUninstall

  nsDialogs::Show

FunctionEnd

Function SetUninstall
  ; Set UninstallSSDCoinSquirrelInstall accordingly
  ${NSD_GetState} $CheckboxUninstall $UninstallSSDCoinSquirrelInstall
FunctionEnd

Function detectOldSSDCoinVersionPageLeave
  ${If} $UninstallSSDCoinSquirrelInstall == 1
    ; This could be improved... Experiments with adding an indeterminate progress bar (PBM_SETMARQUEE)
    ; were unsatisfactory.
    ExecWait $SSDCoinSquirrelUninstaller ; Blocks until complete (doesn't take long though)
  ${EndIf}
FunctionEnd

Function finish

  ; Magic create dialog incantation
  nsDialogs::Create 1018
  Pop $FinishDlg

  ${If} $FinishDlg == error
    Abort
  ${EndIf}

  ${NSD_CreateCheckbox} 0 40% 100% 10% "Launch SSDCoin"
  Pop $CheckboxLaunchOnExit
  ${NSD_SetState} $CheckboxLaunchOnExit ${BST_CHECKED}
  ${NSD_OnClick} $CheckboxLaunchOnExit SetLaunchOnExit
  StrCpy $LaunchOnExit 1

  ${NSD_CreateLabel} 0 65% 100% 10% "Advanced Options:"
  ${NSD_CreateCheckbox} 5% 75% 100% 10% "Add SSDCoin Command Line executable to PATH"
  Pop $CheckboxAddToPath
  ${NSD_SetState} $CheckboxAddToPath ${BST_UNCHECKED}
  ${NSD_OnClick} $CheckboxAddToPath SetAddToPath

  GetDlgItem $NextButton $HWNDPARENT 1 ; 1 = Next button
  GetDlgItem $BackButton $HWNDPARENT 3 ; 3 = Back button

  ${NSD_CreateLabel} 0 35 100% 12u "SSDCoin has been installed successfully!"
  EnableWindow $BackButton 0 ; Disable the Back button
  SendMessage $NextButton ${WM_SETTEXT} 0 "STR:Finish" ; Button title is "Close" by default. Update it here.

  nsDialogs::Show

FunctionEnd

Function SetLaunchOnExit
  ; Set LaunchOnExit accordingly
  ${NSD_GetState} $CheckboxLaunchOnExit $LaunchOnExit
FunctionEnd

Function SetAddToPath
  ; Set AddToPath accordingly
  ${NSD_GetState} $CheckboxAddTopath $AddToPath
FunctionEnd

; Copied from electron-builder NSIS templates
Function StartApp
  ${if} ${isUpdated}
    StrCpy $1 "--updated"
  ${else}
    StrCpy $1 ""
  ${endif}
  ${StdUtils.ExecShellAsUser} $0 "$launchLink" "open" "$1"
FunctionEnd

Function UpdatePath
  ; Parameters: $0 - "all" for all users, "CurrentUser" for the current user
  Exch $0
  Push $1
  Push $2
  Push $3

  Var /GLOBAL CurrentPath
  Var /GLOBAL UpdatedPath
  Var /GLOBAL PathAlreadyIncluded
  Var /GLOBAL CLIPath

  ; Determine the registry key and root key based on the scope
  ${If} $0 == "all"
    ReadRegStr $CurrentPath HKLM "SYSTEM\CurrentControlSet\Control\Session Manager\Environment" "Path"
  ${Else}
    ReadRegStr $CurrentPath HKCU "Environment" "Path"
  ${EndIf}

  ;${If} ${Errors}
  ;  Abort
  ;${EndIf}

  StrCpy $CLIPath "$INSTDIR\resources\app.asar.unpacked\daemon"

  ; Check if the directory is already in PATH
  ${StrContains} $PathAlreadyIncluded $CLIPath $CurrentPath
  ${If} $PathAlreadyIncluded == ""
    StrCpy $UpdatedPath "$CurrentPath;$CLIPath"
    ${If} $0 == "all"
      WriteRegExpandStr HKLM "SYSTEM\CurrentControlSet\Control\Session Manager\Environment" "Path" $UpdatedPath
      System::Call "kernel32::SetEnvironmentVariable(t'Path',t'$UpdatedPath')"
    ${Else}
      WriteRegExpandStr HKCU "Environment" "Path" $UpdatedPath
    ${EndIf}

    SendMessage ${HWND_BROADCAST} ${WM_SETTINGCHANGE} 0 "STR:Environment" /TIMEOUT=3000
  ${EndIf}

  Pop $3
  Pop $2
  Pop $1
  Pop $0
FunctionEnd

Function finishLeave
  ; Update PATH
  ${If} $AddToPath == 1
    Push $installMode
    Call UpdatePath
  ${EndIf}

  ; Launch the app at exit
  ${If} $LaunchOnExit == 1
    Call StartApp
  ${EndIf}
FunctionEnd

; Section
; SectionEnd
!macroend
