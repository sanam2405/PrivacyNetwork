export default interface User {
  _id: string;
  username: string;
  email: string;
  name: string;
  age: number;
  gender: string;
  college: string;
  Photo?: string;
  friends: string[];
}
