import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import { formatDate } from "./formatDate";
import { t } from "i18next";
import { useTranslation } from "react-i18next";

const styles = StyleSheet.create({
  page: {
    flexDirection: "row",
    fontFamily: "Helvetica",
    fontSize: 11,
  },

  sidebar: {
    width: "30%",
    backgroundColor: "#155dfa",
    color: "white",
    padding: 20,
  },

  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    marginBottom: 12,
  },

  sidebarName: {
    fontSize: 17,
    fontWeight: "bold",
    marginBottom: 12,
  },

  sidebarItem: {
    fontSize: 11,
    marginBottom: 8,
  },

  main: {
    width: "70%",
    padding: 25,
  },

  section: {
    marginBottom: 16,
  },

  sectionHeading: {
    fontSize: 13,
    fontWeight: "bold",
    borderBottom: "1px solid #000",
    marginBottom: 6,
    paddingBottom: 3,
  },

  jobBlock: {
    marginBottom: 10,
  },

  eduBlock: {
    marginBottom: 10,
  },

  jobTitle: {
    fontSize: 11.5,
    fontWeight: "bold",
  },

  companyLine: {
    fontSize: 10.5,
    marginTop: 2,
    fontStyle: "italic",
  },

  bulletList: {
    marginTop: 4,
    marginLeft: 10,
  },

  bulletItem: {
    fontSize: 10.5,
    marginBottom: 2,
  },

  eduCollege: {
    fontSize: 11.5,
    fontWeight: "bold",
  },

  eduSub: {
    fontSize: 10.5,
    marginTop: 2,
  },

  eduDate: {
    fontSize: 10,
    marginTop: 2,
    color: "#555",
  },
});

const PDFResume = ({ data }) => {
  const { t } = useTranslation();
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.sidebar}>
          <Image
            src={data.profileData.profilePic || "/default-avatar.png"}
            style={styles.avatar}
          />

          <Text style={styles.sidebarName}>{data.profileData.name}</Text>

          <Text style={styles.sidebarItem}>{data.profileData.email}</Text>
          <Text style={styles.sidebarItem}>{data.profileData.phoneNo}</Text>
          <Text style={styles.sidebarItem}>
            {data.address.currentCity}, {data.address.currentState},{" "}
            {data.address.currentCountry}
          </Text>
        </View>

        <View style={styles.main}>
          <View style={styles.section}>
            <Text style={styles.sectionHeading}>{t("PDFResume.about")}</Text>
            <Text>{data.profileData.about}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionHeading}>
              {t("PDFResume.workExperience")}
            </Text>

            {data.employments.map((job, i) => (
              <View key={i} style={styles.jobBlock}>
                <Text style={styles.jobTitle}>{job.jobTitle}</Text>

                <Text style={styles.companyLine}>
                  {job.company} • {formatDate(job.joiningDate)} –{" "}
                  {job.leaveDate
                    ? formatDate(job.leaveDate)
                    : t("PDFResume.present")}
                </Text>

                <View style={styles.bulletList}>
                  {job.about &&
                    job.about
                      .split(". ")
                      .filter(Boolean)
                      .map((line, idx) => (
                        <Text key={idx} style={styles.bulletItem}>
                          • {line.trim()}
                        </Text>
                      ))}
                </View>
              </View>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionHeading}>
              {t("PDFResume.education")}
            </Text>

            {data.educations.map((edu, i) => (
              <View key={i} style={styles.eduBlock}>
                <Text style={styles.eduCollege}>{edu.college}</Text>

                <Text style={styles.eduSub}>
                  {edu.qualification} • {edu.marks}%
                </Text>

                <Text style={styles.eduDate}>
                  {formatDate(edu.startDate)} –{" "}
                  {edu.isPursuing
                    ? t("PDFResume.present")
                    : formatDate(edu.endDate)}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default PDFResume;
