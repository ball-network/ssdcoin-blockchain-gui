const ServiceName = {
  WALLET: 'ssdcoin_wallet',
  FULL_NODE: 'ssdcoin_full_node',
  FARMER: 'ssdcoin_farmer',
  HARVESTER: 'ssdcoin_harvester',
  SIMULATOR: 'ssdcoin_full_node_simulator',
  DAEMON: 'daemon',
  PLOTTER: 'ssdcoin_plotter',
  TIMELORD: 'ssdcoin_timelord',
  INTRODUCER: 'ssdcoin_introducer',
  EVENTS: 'wallet_ui',
  DATALAYER: 'ssdcoin_data_layer',
  DATALAYER_SERVER: 'ssdcoin_data_layer_http',
} as const;

type ObjectValues<T> = T[keyof T];

export type ServiceNameValue = ObjectValues<typeof ServiceName>;

export default ServiceName;
