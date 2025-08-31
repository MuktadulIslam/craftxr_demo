export const backendBaseURL = "https://api.craftxr.io/api/"


export const config = {
  backendBaseURL: "https://api.craftxr.io/api/",
  timeout: 120000,     // the frontend system will wait maximum to 120 second for the respons 
  localStorageSavingDuration: 500, // 0.5 seconds
  app: {
    name: 'CraftXR',
  },
  evalutionOffsetLimit: 20,
  simulationOffsetLimit: 20,
  endpoints: {
    signup: (invitationToken: string) => `signup/${invitationToken}/`,
    login: 'token/',
    logout: 'token/expire/',
    verifyToken: 'token/verify/',
    refreshToken: 'token/refresh/',

    userData: 'accounts/profile/',

    simulations: 'simulations/',
    simulationsByLimits: (limit: number, offset: number) => `simulations/?limit=${limit}&offset=${offset}`,
    programs: 'programs/',
    program: (programId: string) => `programs/${programId}/`,
    simulation: (simulationId: string) => `simulations/${simulationId}/`,
    simulationSceneConfig: 'simulations/MjIxMjAx/scene-config/',
    simulationAssetsConfig: 'simulations/MjIxMjAx/asset-config/',
    simulationChats: (simulationId: string) => `simulations/${simulationId}/chats/`,
    updateSimulationChats: (simulationChatId: string) => `chats/${simulationChatId}/`,

    evaluations: (limit: number, offset: number) => `sessions/?limit=${limit}&offset=${offset}`,
    evaluation: (evaluationId: string) => `sessions/${evaluationId}/`,

    institutes: '/institutes',
    schools: '/schools',
    departments: '/departments',
  },
  routePaths: {
    login: '/accounts/login',
    signup: '/accounts/signup',
    
    dashboard: '/',
    profile: '/profile',
    simulations: '/simulations',
    evaluations: '/evaluations',
    programs: '/programs',
  },
  token: {
    tokenSecret: 'craftxr-secret-key-for-tokens',
    accessTokenName: 'accessToken',
    refreshTokenName: 'refreshToken',
    accessTokenExpiry: 10 * 60 * 1000, // 10 mins in milliseconds
    // accessTokenExpiry: 10 * 30 * 1000, // 30 seconds in milliseconds
    refreshTokenExpiry: 4 * 60 * 60 * 1000, // 4 hours in milliseconds
  },
  callbackUrlName: 'next'
};


export const inputMaxLength = {
  avatar: {
    designation: 50
  },
  chat: {
    dialog: 500,
    intent: 50,
    topic: 50,
    segment: 250,
    breathing_style: 50,
    transition_action: 50,
    conv_id: 50
  },
  institute: {
    name: 50,
    alias: 10
  },
  school: {
    name: 50,
    alias: 10
  },
  department: {
    name: 50,
  },
  program: {
    name: 50,
    alias: 10
  },
  programAffiliation: {
    name: 10
  },
  scene: {
    floor_rows: 50,
    floor_column: 50,
    asset_name: 50,
    scene_description: 250
  },
  chatHistory: {
    dialog_rendered: 500
  },
  scenario: {
    name: 50,
    description: 500,
    overview: 500,
    related_details: 1000

  },
  simulation: {
    title: 50,
    objectives: 100,
  }
}