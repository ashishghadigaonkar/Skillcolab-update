import mongoose from "mongoose";
import { UserModel } from "../../services/mongodbService";
import { dbState, saveDb } from "../../shared/database/dbState";
import { DEFAULT_USER } from "../../shared/database/defaults";
import { UserRole } from "../../types";

export class AuthRepository {
  async register(email: string, fullName: string, role: string) {
    dbState.user = {
      ...DEFAULT_USER,
      email: email || DEFAULT_USER.email,
      fullName: fullName || DEFAULT_USER.fullName,
      role: (role as UserRole) || UserRole.STUDENT,
    };
    saveDb();
    return dbState.user;
  }

  async login(email: string) {
    if (email) {
      dbState.user.email = email;
      saveDb();
    }
    return dbState.user;
  }

  async syncUser(uid: string, email: string, fullName: string, avatarUrl: string, extraData?: any) {
    if (mongoose.connection.readyState !== 1) {
      dbState.user = {
        ...dbState.user,
        id: uid,
        email: email || dbState.user.email,
        fullName: fullName || dbState.user.fullName,
        avatarUrl: avatarUrl || dbState.user.avatarUrl,
        username: extraData?.username || dbState.user.username || "",
        firstName: extraData?.firstName || dbState.user.firstName || "",
        lastName: extraData?.lastName || dbState.user.lastName || "",
        college: extraData?.college || dbState.user.college || "",
        branch: extraData?.branch || dbState.user.branch || "",
        graduationYear: extraData?.graduationYear || dbState.user.graduationYear || null,
        interests: extraData?.interests || dbState.user.interests || [],
        careerGoals: extraData?.careerGoals || dbState.user.careerGoals || "",
        onboardingCompleted: (dbState.user.id === uid && dbState.user.onboardingCompleted === true) || extraData?.onboardingCompleted === true
      };
      saveDb();
      return dbState.user;
    }

    try {
      let liveUser = await UserModel.findOne({ firebaseUid: uid });
      if (!liveUser) {
        liveUser = await UserModel.create({
          firebaseUid: uid,
          email,
          fullName,
          role: UserRole.STUDENT,
          avatarUrl,
          firstName: extraData?.firstName || "",
          lastName: extraData?.lastName || "",
          username: extraData?.username || "",
          college: extraData?.college || "",
          branch: extraData?.branch || "",
          graduationYear: extraData?.graduationYear || null,
          interests: extraData?.interests || [],
          careerGoals: extraData?.careerGoals || "",
          onboardingCompleted: extraData?.onboardingCompleted || false,
          skills: [],
          education: [],
          experience: [],
          certifications: [],
          achievements: [],
          links: {},
          reputationPoints: 100,
          badges: ["Early Contributor"]
        });
      } else {
        // Update if onboarding completed state has toggled or there are extra details
        let needsUpdate = false;
        // Never overwrite true onboardingCompleted back to false during synchronizations
        if (extraData?.onboardingCompleted === true && !liveUser.onboardingCompleted) {
          liveUser.onboardingCompleted = true;
          needsUpdate = true;
        }
        if (extraData?.college && !liveUser.college) {
          liveUser.college = extraData.college;
          needsUpdate = true;
        }
        if (extraData?.branch && !liveUser.branch) {
          liveUser.branch = extraData.branch;
          needsUpdate = true;
        }
        if (extraData?.graduationYear && !liveUser.graduationYear) {
          liveUser.graduationYear = extraData.graduationYear;
          needsUpdate = true;
        }
        if (needsUpdate) {
          await liveUser.save();
        }
      }
      
      const parsedUser = {
        id: liveUser.firebaseUid || liveUser._id.toString(),
        email: liveUser.email,
        fullName: liveUser.fullName,
        role: liveUser.role,
        avatarUrl: liveUser.avatarUrl,
        coverUrl: liveUser.coverUrl || "",
        headline: liveUser.headline || "",
        bio: liveUser.bio || "",
        location: liveUser.location || "",
        skills: liveUser.skills || [],
        education: liveUser.education || [],
        experience: liveUser.experience || [],
        certifications: liveUser.certifications || [],
        achievements: liveUser.achievements || [],
        resumeUrl: liveUser.resumeUrl || "",
        links: liveUser.links || {},
        reputationPoints: liveUser.reputationPoints || 100,
        badges: liveUser.badges || [],
        connectionsCount: liveUser.connectionsCount || 0,
        followersCount: liveUser.followersCount || 0,
        username: liveUser.username || "",
        firstName: liveUser.firstName || "",
        lastName: liveUser.lastName || "",
        college: liveUser.college || "",
        branch: liveUser.branch || "",
        graduationYear: liveUser.graduationYear || undefined,
        interests: liveUser.interests || [],
        careerGoals: liveUser.careerGoals || "",
        onboardingCompleted: liveUser.onboardingCompleted || false,
      };

      dbState.user = parsedUser;
      saveDb();
      return parsedUser;
    } catch (err) {
      console.error("[AuthSync] Error saving synced user to MongoDB:", err);
      throw err;
    }
  }
}
export const authRepository = new AuthRepository();
