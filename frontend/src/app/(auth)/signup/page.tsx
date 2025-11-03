"use client"

import Link from "next/link";
import { User, Briefcase } from "lucide-react";
import styles from "./Signup.module.css";
import { useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";

export default function SignupPage() {

    const { user, isAuthenticated, loading, fetchUser } = useAuthStore();
    const router = useRouter()
  
    useEffect(() => {
      if (loading) fetchUser();
    }, [loading, fetchUser]);
  
    useEffect(() => {
      if (!loading && isAuthenticated && user) {
        if (user.role === "admin") router.replace("/admin/dashboard");
        else if (user.role === "worker") router.replace("/worker/home");
        else router.replace("/client/home");
      }
    }, [isAuthenticated, user, loading, router]);
  
    if (loading || isAuthenticated) return  null;

  return (
    <main className={styles.container}>
      <Link href="/signup/client" className={`${styles.panel} ${styles.userPanel}`}>
        <div className={styles.content}>
          <User className={styles.icon} size={64} strokeWidth={1.5} />
          <h2 className={styles.title}>Join as a Client</h2>
          <p className={styles.description}>
            Find and hire professionals for any task.
          </p>
        </div>
      </Link>
      <Link href="/signup/worker" className={`${styles.panel} ${styles.workerPanel}`}>
        <div className={styles.content}>
          <Briefcase className={styles.icon} size={64} strokeWidth={1.5} />
          <h2 className={styles.title}>Join as a Worker</h2>
          <p className={styles.description}>
            Offer your skills and find your next project.
          </p>
        </div>
      </Link>
    </main>
  );
}