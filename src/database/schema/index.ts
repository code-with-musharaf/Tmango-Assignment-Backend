import { SessionSchema } from "./session.schema";
import { UserSchema } from "./user.schema";
import { ChallengeSchema } from "./challenges.schema";
import { SubmissionSchema } from "./submissions.schema";

export const DatabaseSchemas = [
  { name: "Session", schema: SessionSchema },
  { name: "User", schema: UserSchema },
  { name: "Challenge", schema: ChallengeSchema },
  { name: "Submission", schema: SubmissionSchema },
];
