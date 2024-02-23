import { useGetAutoWithdrawStakeQuery, useSetAutoWithdrawStakeMutation } from '@ssdcoin-network/api-react';
import { Flex, Form, ButtonLoading, Fee, SettingsLabel, ssdcoinToMojo, mojoToSSDCoin, toExponential } from '@ssdcoin-network/core';
import { Trans } from '@lingui/macro';
import {Box} from '@mui/material';
import React, {useEffect} from 'react';
import { useForm } from 'react-hook-form';

export default function SettingsStake(props) {
  const {
    data: withdrawStake,
    isLoading
  } = useGetAutoWithdrawStakeQuery();

  const [
    setAutoWithdrawStake,
    { isLoading: isSetWithdrawStakeLoading }
  ] = useSetAutoWithdrawStakeMutation();

  const autoWithdrawStakeFee = toExponential(
    withdrawStake?.txFee ? mojoToSSDCoin(withdrawStake.txFee).toNumber() : 0
  );
  const methods = useForm({
    defaultValues: {
      fee: autoWithdrawStakeFee
    }
  });

  useEffect(() => {
    if (autoWithdrawStakeFee !== null && autoWithdrawStakeFee !== undefined) {
      methods.setValue('fee', autoWithdrawStakeFee);
    }
  }, [autoWithdrawStakeFee, methods]);

  async function handleSubmit({ fee }: { fee: number }) {
    const feeInMojos = ssdcoinToMojo(fee);
    await setAutoWithdrawStake({
      txFee: feeInMojos,
      batchSize: 50,
    }).unwrap();

    // hook form does not reset isDirty after submit
    methods.reset({}, { keepValues: true });
  }

  return (
    <Box sx={{ width: '100%' }} {...props}>
      <SettingsLabel>
        <Trans>Auto Withdraw Stake</Trans>
      </SettingsLabel>
      <Form methods={methods}  onSubmit={handleSubmit}>
        <Flex flexDirection="column" gap={1}>
          <Flex gap={2} sx={{ marginTop: 1, alignItems: 'flex-start' }}>
            <Fee
              id="filled-secondary"
              name="fee"
              size="small"
              color="secondary"
              disabled={isSetWithdrawStakeLoading || isLoading}
              label={<Trans>Transaction auto withdraw fee</Trans>}
              data-testid="SettingsWithdrawStake-fee"
              fullWidth
            />
          </Flex>
          <ButtonLoading
            size="small"
            type="submit"
            variant="contained"
            color="primary"
            loading={isSetWithdrawStakeLoading}
            disabled={!methods.formState.isDirty}
            data-testid="SettingsWithdrawStake-save"
          >
           <Trans>Save</Trans>
          </ButtonLoading>
        </Flex>
      </Form>
    </Box>
  );
}
