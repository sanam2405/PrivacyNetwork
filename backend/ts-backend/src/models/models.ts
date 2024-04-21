import mongoose, { Schema, Document, Types } from "mongoose";

export interface UserDocument extends Document {
  name: string;
  username: string;
  email: string;
  password: string;
  Photo?: string;
  age?: number;
  gender?: string;
  college?: string;
  friends: Types.ObjectId[];
  visibility: boolean;
}

/**
 * @openapi
 * components:
 *  schemas:
 *    User:
 *      type: object
 *      properties:
 *        _id:
 *          type: string
 *        name:
 *          type: string
 *        username:
 *          type: string
 *        email:
 *          type: string
 *        friends:
 *          type: array
 *          items:
 *            type: object
 *            properties:
 *              _id:
 *                type: string
 *        Photo:
 *          type: string
 *        age:
 *          type: number
 *        gender:
 *          type: string
 *        college:
 *          type: string
 *        visibility:
 *          type: boolean
 *    AllUsers:
 *      type: array
 *      items:
 *        $ref: '#/components/schemas/User'
 *    CreateUserInput:
 *      type: object
 *      required:
 *        - email
 *        - username
 *        - name
 *        - password
 *      properties:
 *        email:
 *          type: string
 *          default: rohit@gmail.com
 *        username:
 *          type: string
 *          default: Rohit
 *        name:
 *          type: string
 *          default: Rohit Roy
 *        password:
 *          type: string
 *          default: Abc_123
 *    CreateUserResponse:
 *      type: object
 *      properties:
 *        _id:
 *          type: string
 *        email:
 *          type: string
 *        name:
 *          type: string
 *        username:
 *          type: string
 *        createdAt:
 *          type: string
 *        updatedAt:
 *          type: string
 *    LoginUserInput:
 *      type: object
 *      required:
 *        - email
 *        - password
 *      properties:
 *        email:
 *          type: string
 *          default: rohit@gmail.com
 *        password:
 *          type: string
 *          default: Abc_123
 *    LoginUserResponse:
 *      type: object
 *      properties:
 *        success:
 *          type: boolean
 *        username:
 *          type: string
 *        token:
 *          type: string
 *        user:
 *          $ref: '#/components/schemas/User'
 *    LocationInput:
 *      type: object
 *      properties:
 *        userId:
 *          type: string
 *          default: Manasass2345w53q46f
 *        latitude:
 *          type: number
 *          default: 22.40456
 *        longitude:
 *          type: number
 *          default: 88.1260
 *        thresholdDistance:
 *          type: number
 *          default: 70000
 *        college:
 *          type: string
 *          default: College 3
 *        age:
 *          type: number
 *          default: 60
 *        gender:
 *          type: string
 *          default: Male
 *    LocationResponse:
 *      type: array
 *      items:
 *        type: object
 *        properties:
 *          id:
 *            type: string
 *          name:
 *            type: string
 *          email:
 *            type: string
 *          lat:
 *            type: number
 *          long:
 *            type: number
 *          college:
 *            type: string
 *          age:
 *            type: number
 *          gender:
 *            type: string
 *          isVisible:
 *            type: boolean
 *          dist_meters:
 *            type: number
 */

const userSchema: Schema<UserDocument> = new Schema({
  name: { type: String, required: true },
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  Photo: { type: String },
  age: { type: Number },
  gender: { type: String },
  college: { type: String },
  friends: [{ type: Schema.Types.ObjectId, ref: "user" }],
  visibility: { type: Boolean },
});

const User = mongoose.model<UserDocument>("user", userSchema);

export default User;
