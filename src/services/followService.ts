/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { FollowerRelation } from "../types";

export class FollowService {
  /**
   * Fetch all followed entities of the current user
   */
  static async getFollowing(): Promise<FollowerRelation[]> {
    try {
      const res = await fetch("/api/follows");
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.error("Error in getFollowing:", e);
    }
    return [];
  }

  /**
   * Toggle follow state for a target entity.
   * Returns true if now followed, false if unfollowed, or null if error occurred.
   */
  static async toggleFollow(followingId: string, followingType: "student" | "mentor" | "company"): Promise<boolean | null> {
    try {
      const res = await fetch("/api/follows", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ followingId, followingType }),
      });
      if (res.ok) {
        const data = await res.json();
        return data.followed;
      }
    } catch (e) {
      console.error("Error in toggleFollow:", e);
    }
    return null;
  }
}
