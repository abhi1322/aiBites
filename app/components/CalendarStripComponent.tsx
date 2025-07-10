import moment from "moment";
import React from "react";
import { StyleSheet, View } from "react-native";
import CalendarStrip from "react-native-calendar-strip";

interface CalendarStripComponentProps {
  selectedDate: moment.Moment;
  onDateChange: (date: moment.Moment) => void;
  markedDates?: (string | moment.Moment)[];
}

export default function CalendarStripComponent({
  selectedDate,
  onDateChange,
  markedDates = [],
}: CalendarStripComponentProps) {
  const today = moment();
  const minDate = moment().subtract(20, "days");
  const maxDate = moment().add(3, "days");

  // Create marked dates array with today having a dot
  const marked = markedDates.map((date) => ({
    date: moment.isMoment(date) ? date : moment(date),
    dots: [
      {
        color: "#3B82F6",
        selectedColor: "#3B82F6",
      },
    ],
  }));

  // Add today's dot marker
  marked.push({
    date: today,
    dots: [
      {
        color: "#101010",
        selectedColor: "#101010",
      },
    ],
  });

  // Create array of marked date strings for easy checking
  const markedDateStrings = marked.map((item) =>
    item.date.format("YYYY-MM-DD")
  );

  // Function to get day container style based on whether date is marked
  const getDayContainerStyle = (date: moment.Moment) => {
    const isMarked = markedDateStrings.includes(date.format("YYYY-MM-DD"));
    return isMarked ? styles.dayContainerMarked : styles.dayContainer;
  };

  return (
    <View style={styles.container}>
      <CalendarStrip
        scrollable={true}
        scrollToOnSetSelectedDate={true}
        maxDate={maxDate}
        minDate={minDate}
        selectedDate={selectedDate}
        onDateSelected={onDateChange}
        // Header styling
        calendarHeaderStyle={styles.headerStyle}
        showMonth={true}
        // Main calendar styling
        style={styles.calendarStyle}
        calendarColor="#FFFFFF"
        // Day container styling - simple single color
        dayContainerStyle={styles.dayContainer}
        // Custom styling function for marked dates and selected date
        customDatesStyles={[
          ...marked.map((item) => ({
            date: item.date,
            style: styles.dayContainerMarked,
            textStyle: styles.dateNumber,
          })),
          {
            date: selectedDate,
            style: styles.gradientSelectedContainer,
            textStyle: styles.selectedDateNumber,
          },
        ]}
        // Normal date styling
        dateNumberStyle={styles.dateNumber}
        dateNameStyle={styles.dateName}
        showDayName={false}
        // Selected date styling
        highlightDateContainerStyle={styles.selectedDateContainer}
        highlightDateNumberStyle={styles.selectedDateNumber}
        highlightDateNameStyle={styles.selectedDateName}
        // Disabled date styling
        disabledDateOpacity={0.3}
        disabledDateNameStyle={styles.disabledDateName}
        disabledDateNumberStyle={styles.disabledDateNumber}
        // Marked dates (dots)
        markedDates={marked}
        markedDatesStyle={styles.markedDot}
        // Remove navigation arrows
        iconLeft={null}
        iconRight={null}
        leftSelector={[]}
        rightSelector={[]}
        // Responsive sizing
        maxDayComponentSize={70}
        minDayComponentSize={50}
        dayComponentHeight={80}
        // Animation with gradient colors
        daySelectionAnimation={{
          type: "background",
          duration: 200,
          highlightColor: "transparent",
        }}
        // Text formatting
        shouldAllowFontScaling={false}
        upperCaseDays={false}
        // Scrolling behavior
        scrollerPaging={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: "#000",
    overflow: "visible",
  },
  calendarStyle: {
    height: 140,
    paddingTop: 20,
    paddingBottom: 20,
    overflow: "visible",
  },
  headerStyle: {
    fontFamily: "Poppins",
    fontWeight: "600",
    fontSize: 16,
    color: "#171717",
    marginBottom: 15,
  },

  // Day container - simple single color background (non-marked dates)
  dayContainer: {
    backgroundColor: "#E4E4E4",
    borderRadius: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
    // condition to check if the marked date is today
    paddingTop: 6,
    height: 50,
    width: 50,
    fontSize: 16,
    fontWeight: "400",
    overflow: "visible",
    position: "relative",
  },

  // Day container for marked dates (no padding)
  dayContainerMarked: {
    backgroundColor: "#E4E4E4",
    borderRadius: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
    paddingBottom: 10,
    height: 50,
    width: 50,
    fontSize: 16,
    fontWeight: "400",
    overflow: "visible",
    position: "relative",
  },

  // Normal date styling - centered text
  dateNumber: {
    color: "#fff",
    fontFamily: "Poppins",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  dateName: {
    color: "#6B7280",
    fontFamily: "Poppins",
    fontSize: 11,
    fontWeight: "400",
    textAlign: "center",
    marginTop: 2,
  },

  // Selected date styling
  selectedDateContainer: {
    backgroundColor: "#171717",
    fontFamily: "Poppins",
    fontSize: 16,
    fontWeight: "400",
    borderRadius: "100%",
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    width: 50,
    overflow: "visible",
    position: "relative",
  },
  selectedDateNumber: {
    color: "#FFFFFF",
    fontFamily: "Poppins",
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
  },
  selectedDateName: {
    color: "#FFFFFF",
    fontFamily: "Poppins",
    fontSize: 11,
    fontWeight: "500",
    textAlign: "center",
    marginTop: 2,
  },

  // Disabled date styling
  disabledDateName: {
    color: "#D1D5DB",
    fontFamily: "Poppins",
    fontSize: 11,
    fontWeight: "400",
  },
  disabledDateNumber: {
    color: "#D1D5DB",
    fontFamily: "Poppins",
    fontSize: 16,
    fontWeight: "600",
  },

  // Marked dates dot styling - positioned outside container
  markedDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#2E2E2E",
    position: "absolute",
    bottom: -25,
    // left: "50%",
    // marginLeft: -3,
  },

  // Custom styling for selected dates with gradient
  gradientSelectedContainer: {
    backgroundColor: "#667eea",
    borderRadius: "100%",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    width: "100%",
    overflow: "visible",
    position: "relative",
    zIndex: 1000,
  },
});
