import { SignedIn, SignedOut } from "@clerk/clerk-expo";
import { Redirect } from "expo-router";
import React from "react";

export default function RootIndex() {
  return (
    <>
      <SignedIn>
        <Redirect href="/(app)" />
      </SignedIn>
      <SignedOut>
        <Redirect href="/(auth)/sign-in" />
      </SignedOut>
    </>
  );
}
