import React from "react";
import { Alert, Linking } from "react-native";
import * as MailComposer from "expo-mail-composer";

export const supportEmail = "kumarabhishek282001@gmail.com";

export interface EmailTemplate {
  subject: string;
  body: string;
}

export const emailTemplates = {
  login: {
    subject: "Support Request - Login Issue",
    body: `Hi Support Team,

I'm having trouble logging into my account.

Issue: Can't log in to my account
Details: [Please describe what happens when you try to log in]

My email: [Your registered email]
Error message (if any): [Any error message you see]

Please help me resolve this issue.

Thanks!`,
  },
  analysis: {
    subject: "Support Request - Food Analysis Issue",
    body: `Hi Support Team,

The food analysis feature is not working properly.

Issue: Food analysis not working
Details: [Please describe what happens when you try to analyze food]

Camera permissions: [Yes/No]
Lighting conditions: [Good/Poor]
Error message (if any): [Any error message you see]

Please help me resolve this issue.

Thanks!`,
  },
  sync: {
    subject: "Support Request - Data Sync Issue",
    body: `Hi Support Team,

My data is not syncing properly.

Issue: Data not syncing
Details: [Please describe what data is not syncing]

Internet connection: [WiFi/Mobile Data]
Last successful sync: [When did it last work]
Error message (if any): [Any error message you see]

Please help me resolve this issue.

Thanks!`,
  },
  crash: {
    subject: "Support Request - App Crashes",
    body: `Hi Support Team,

The app crashes frequently.

Issue: App crashes frequently
Details: [Please describe when the app crashes]

Device model: [Your device model]
OS version: [Your OS version]
App version: 1.0.0
When it crashes: [During specific actions or randomly]

Please help me resolve this issue.

Thanks!`,
  },
  bugReport: {
    subject: "Bug Report - AIBite App",
    body: `Hi Support Team,

I would like to report a bug in the AIBite app.

Bug Details:
- What happened: [Describe the bug]
- Expected behavior: [What should have happened]
- Steps to reproduce: [How to reproduce the bug]
- Frequency: [How often does this happen]

Device Information:
- Device: [Your device model]
- OS Version: [Your OS version]
- App Version: 1.0.0
- Build: 2024.1.1

Additional Information:
[Any other relevant details]

Thanks for your help in making the app better!`,
  },
  featureSuggestion: {
    subject: "Feature Suggestion - AIBite App",
    body: `Hi Support Team,

I would like to suggest a new feature for the AIBite app.

Feature Suggestion:
- Feature name: [Name of the feature]
- Description: [Detailed description of the feature]
- Why it would be useful: [Benefits of this feature]
- How it should work: [Your vision of how it should function]

Use Case:
[Describe when and how you would use this feature]

Priority:
[High/Medium/Low]

Additional Notes:
[Any other relevant information]

Thanks for considering my suggestion!`,
  },
};

export const sendEmail = async (template: EmailTemplate, customSubject?: string, customBody?: string) => {
  const subject = customSubject || template.subject;
  const body = customBody || template.body;

  try {
    const isAvailable = await MailComposer.isAvailableAsync();
    if (isAvailable) {
      await MailComposer.composeAsync({
        recipients: [supportEmail],
        subject,
        body,
      });
    } else {
      // Fallback to mailto link
      const encodedBody = encodeURIComponent(body);
      const url = `mailto:${supportEmail}?subject=${encodeURIComponent(subject)}&body=${encodedBody}`;
      await Linking.openURL(url);
    }
  } catch (error) {
    Alert.alert(
      "Error",
      "Unable to open email app. Please contact us directly at " + supportEmail
    );
  }
};

export const handleCommonIssue = async (issueType: string, issueTitle: string) => {
  const template = emailTemplates[issueType as keyof typeof emailTemplates];
  
  if (template) {
    await sendEmail(template);
  } else {
    // Default template for unknown issues
    const defaultTemplate: EmailTemplate = {
      subject: `Support Request - ${issueTitle}`,
      body: `Hi Support Team,

I need help with: ${issueTitle}

Details: [Please describe your issue here]

Thanks!`,
    };
    await sendEmail(defaultTemplate);
  }
};

export const handleReportBug = async () => {
  await sendEmail(emailTemplates.bugReport);
};

export const handleFeatureSuggestion = async () => {
  await sendEmail(emailTemplates.featureSuggestion);
};

export const handleFAQ = () => {
  Alert.alert("FAQ", "Opening frequently asked questions...");
}; 