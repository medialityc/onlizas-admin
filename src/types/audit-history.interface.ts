export interface Activity {
  action: string;
  gateway: string;
  user: string;
  time: string;
}

export interface Log {
  timestamp: string;
  action: string;
  gateway: string;
  user: string;
  ip: string;
  details: string;
}

export interface ConfigChange {
  gateway: string;
  field: string;
  oldValue: string;
  newValue: string;
  user: string;
  timestamp: string;
}
