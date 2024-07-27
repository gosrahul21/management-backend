export const template = (index: string) => {
  return {
    index_patterns: `am-${index}*`,
    settings: {
      number_of_shards: 1,
      number_of_replicas: 0,
      index: {
        refresh_interval: '5s',
      },
    },
    mappings: {
      _source: {
        enabled: true,
      },
      properties: {
        level: {
          index: true,
          type: 'text',
        },
        source: {
          index: true,
          type: 'text',
        },
        '@timestamp': {
          index: true,
          type: 'date',
        },
        message: {
          index: true,
          type: 'text',
        },
        details: {
          index: true,
          type: 'object',
        },
      },
    },
  };
};

export const clientOpts = (username: string, password: string) => {
  return {
    node: 'http://localhost:9200',
    auth: {
      username: username,
      password: password,
    },
  };
};
