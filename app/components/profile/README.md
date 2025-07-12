# Profile Components

This directory contains reusable components for profile and settings screens.

## Components

### SettingsCard

A reusable card component for individual settings items.

**Props:**

- `title: string` - The main title of the setting
- `subtitle?: string` - Optional subtitle/description
- `icon: React.ReactNode` - Icon to display
- `onPress: () => void` - Function to call when pressed
- `showBorder?: boolean` - Whether to show bottom border (default: true)

**Usage:**

```tsx
import { SettingsCard } from "@/app/components/profile";

<SettingsCard
  title="Edit Profile"
  subtitle="Update your personal information"
  icon={<User size={20} color="#6b7280" />}
  onPress={() => router.push("/settings/edit-profile")}
/>;
```

### SettingsContainer

A container component that wraps settings sections with proper styling and title.

**Props:**

- `title: string` - The section title
- `children: React.ReactNode` - SettingsCard components
- `className?: string` - Additional CSS classes

**Usage:**

```tsx
import { SettingsContainer, SettingsCard } from "@/app/components/profile";

<SettingsContainer title="Account Settings">
  <SettingsCard
    title="Edit Profile"
    subtitle="Update your personal information"
    icon={<User size={20} color="#6b7280" />}
    onPress={() => router.push("/settings/edit-profile")}
  />
  <SettingsCard
    title="Notifications"
    subtitle="Manage your notification preferences"
    icon={<Bell size={20} color="#6b7280" />}
    onPress={() => router.push("/settings/notifications")}
    showBorder={false} // No border for last item
  />
</SettingsContainer>;
```

## Constants

### createSettingsSections

A function that creates the settings sections configuration with proper navigation.

**Parameters:**

- `router: any` - The router instance for navigation

**Returns:**

- `SettingsSection[]` - Array of settings sections with items

**Types:**

```tsx
interface SettingsItem {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  onPress: () => void;
}

interface SettingsSection {
  title: string;
  items: SettingsItem[];
}
```

**Usage:**

```tsx
import { createSettingsSections } from "@/app/components/profile";

const settingsSections = createSettingsSections(router);

// Use in your component
{
  settingsSections.map((section) => (
    <SettingsContainer key={section.title} title={section.title}>
      {section.items.map((item, itemIndex) => (
        <SettingsCard
          key={item.title}
          title={item.title}
          subtitle={item.subtitle}
          icon={item.icon}
          onPress={item.onPress}
          showBorder={itemIndex !== section.items.length - 1}
        />
      ))}
    </SettingsContainer>
  ));
}
```

## Example Implementation

The profile screen (`app/(app)/(tabs)/profile.tsx`) demonstrates how to use these components together to create a complete settings interface.
