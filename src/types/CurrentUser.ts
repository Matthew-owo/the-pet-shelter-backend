interface CurrentUser {
  uid: string;
  email: string | undefined;
  role: string;
}

export default CurrentUser;
