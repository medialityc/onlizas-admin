// TODO: Implement provider profile

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile | ZAS Express",
  description: "Provider profile and account settings",
  icons: {
    icon: "/assets/images/NEWZAS.svg",
  },
};

export default function ProfilePage() {
  return <h1>Provider Profile</h1>;
}
