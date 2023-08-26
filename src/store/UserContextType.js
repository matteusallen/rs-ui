//@flow
export type UserContextType = {|
  getLastRejectedUrl: () => string,
  onLogin: () => void,
  onLogout: () => void,
  onUpdate: () => void,
  rejectRoute: () => void,
  rejectedRoutes: string[],
  user: {
    email: string,
    firstName: string,
    id: string,
    lastName: string,
    phone: string,
    role: {
      id: string,
      name: string
    },
    venues: { id: string }[]
  }
|};
