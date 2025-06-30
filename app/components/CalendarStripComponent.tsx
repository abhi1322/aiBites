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
  const minDate = moment().subtract(15, "days");
  const maxDate = moment().add(3, "days");

  // Always mark today with a custom style
  const marked = [
    ...markedDates.map((date) => (moment.isMoment(date) ? date : moment(date))),
    {
      date: today,
      dots: [
        {
          color: "#3B82F6",
          selectedDotColor: "#3B82F6",
        },
      ],
      customStyles: {
        container: {
          backgroundColor: "#E0F2FE", // light blue
        },
        dateName: {
          color: "#2563EB",
        },
        dateNumber: {
          color: "#2563EB",
        },
      },
    },
  ];

  return (
    <View style={styles.container}>
      <CalendarStrip
        scrollable={true}
        scrollToOnSetSelectedDate={true}
        // showMonth={false}
        maxDate={maxDate}
        minDate={minDate}
        selectedDate={selectedDate}
        onDateSelected={onDateChange}
        markedDates={marked}
        style={{ height: 100, paddingTop: 20, paddingBottom: 10 }}
        calendarColor="#fff"
        dateNumberStyle={{ color: "#222" }}
        dateNameStyle={{ color: "#222" }}
        highlightDateNumberStyle={{ color: "#fff" }}
        highlightDateNameStyle={{ color: "#fff" }}
        highlightDateContainerStyle={{ backgroundColor: "#3B82F6" }}
        iconLeft={null}
        iconRight={null}
        iconLeftStyle={{ width: 0, height: 0 }}
        iconRightStyle={{ width: 0, height: 0 }}
        scrollerPaging={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
});
