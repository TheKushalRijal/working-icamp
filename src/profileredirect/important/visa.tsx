import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Platform,
  Dimensions
} from 'react-native';
//import { Feather as Icon } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/Feather';
import TopNav from '../../components/navigation/TopNav';

const VisaPage = () => {
  const [activeTab, setActiveTab] = useState<'f1' | 'duration' | 'renewal'>('f1');

  const visaTypes = [
    { type: 'F-1', description: 'Academic Students', duration: 'Duration of Study + OPT' },
    { type: 'J-1', description: 'Exchange Visitors', duration: 'Program Length + 30 Days' },
    { type: 'M-1', description: 'Vocational Students', duration: '1 Year (Extendable)' },
  ];

  const f1Dos = [
    'Maintain full-time enrollment',
    'Keep passport valid at all times',
    'Report address changes within 10 days',
    'Apply for OPT before program end date',
    'Attend the school you were approved for'
  ];

  const f1Donts = [
    'Work off-campus without authorization',
    'Let your I-20 expire',
    'Violate your status (drugs, crimes, etc.)',
    'Stay beyond grace period (60 days after program)',
    'Engage in unauthorized studies'
  ];

  const renewalSteps = [
    { step: 1, title: "Check Eligibility", description: "Ensure you meet requirements for visa renewal" },
    { step: 2, title: "Complete DS-160", description: "Fill out the online nonimmigrant visa application" },
    { step: 3, title: "Pay MRV Fee", description: "Pay the machine-readable visa fee ($185 for F-1)" },
    { step: 4, title: "Schedule Interview", description: "Book appointment at US embassy/consulate" },
    { step: 5, title: "Prepare Documents", description: "I-20, transcripts, financial proof, etc." },
    { step: 6, title: "Attend Interview", description: "Be prepared to explain your continued studies" },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top Navigation Bar */}
      <TopNav title="Visa Information" />
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header */}
        {/* <View style={styles.header}>
          <View>
            <Text style={styles.title}>Visa Information</Text>
            <Text style={styles.subtitle}>Guidance for Nepali students</Text>
          </View>
        </View> */}

        {/* Mobile Tabs */}
        {Platform.OS === 'web' ? (
          <View style={styles.desktopTabs}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'f1' && styles.activeTab]}
              onPress={() => setActiveTab('f1')}
            >
              <Icon name="info" size={16} color={activeTab === 'f1' ? 'white' : '#4a5568'} />
              <Text style={[styles.tabText, activeTab === 'f1' && styles.activeTabText]}>F-1 Guide</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'duration' && styles.activeTab]}
              onPress={() => setActiveTab('duration')}
            >
              <Icon name="clock" size={16} color={activeTab === 'duration' ? 'white' : '#4a5568'} />
              <Text style={[styles.tabText, activeTab === 'duration' && styles.activeTabText]}>Durations</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'renewal' && styles.activeTab]}
              onPress={() => setActiveTab('renewal')}
            >
              <Icon name="file-text" size={16} color={activeTab === 'renewal' ? 'white' : '#4a5568'} />
              <Text style={[styles.tabText, activeTab === 'renewal' && styles.activeTabText]}>Renewal</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.tabSwitcher}>
            <TouchableOpacity
              style={styles.mobileTab}
              onPress={() => setActiveTab('f1')}
            >
              <Text style={activeTab === 'f1' ? styles.activeMobileTabText : styles.mobileTabText}>
                F-1 Guide
              </Text>
              {activeTab === 'f1' && <View style={styles.tabIndicator} />}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.mobileTab}
              onPress={() => setActiveTab('duration')}
            >
              <Text style={activeTab === 'duration' ? styles.activeMobileTabText : styles.mobileTabText}>
                Durations
              </Text>
              {activeTab === 'duration' && <View style={styles.tabIndicator} />}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.mobileTab}
              onPress={() => setActiveTab('renewal')}
            >
              <Text style={activeTab === 'renewal' ? styles.activeMobileTabText : styles.mobileTabText}>
                Renewal
              </Text>
              {activeTab === 'renewal' && <View style={styles.tabIndicator} />}
            </TouchableOpacity>
          </View>
        )}

        {/* Content Area */}
        <View style={styles.content}>
          {activeTab === 'f1' && (
            <View>
              <Text style={styles.sectionTitle}>F-1 Visa Guidelines</Text>
              
              <View style={styles.cardGroup}>
                <View style={[styles.card, styles.doCard]}>
                  <Text style={styles.cardTitle}>
                    <Icon name="check-circle" size={16} color="#38a169" /> Must Do
                  </Text>
                  <View style={styles.list}>
                    {f1Dos.map((item, index) => (
                      <View key={index} style={styles.listItem}>
                        <View style={styles.listBullet} />
                        <Text style={styles.listText}>{item}</Text>
                      </View>
                    ))}
                  </View>
                </View>
                
                <View style={[styles.card, styles.dontCard]}>
                  <Text style={styles.cardTitle}>
                    <Icon name="alert-triangle" size={16} color="#e53e3e" /> Must Avoid
                  </Text>
                  <View style={styles.list}>
                    {f1Donts.map((item, index) => (
                      <View key={index} style={styles.listItem}>
                        <View style={[styles.listBullet, { backgroundColor: '#e53e3e' }]} />
                        <Text style={styles.listText}>{item}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </View>

              <View style={styles.noteBox}>
                <Text style={styles.noteText}>
                  <Text style={{ fontWeight: 'bold' }}>Important:</Text> Violating F-1 regulations can lead to deportation. 
                  Always consult your DSO before making any status changes.
                </Text>
              </View>
            </View>
          )}

          {activeTab === 'duration' && (
            <View>
              <Text style={styles.sectionTitle}>Visa Types & Durations</Text>
              
              <View style={styles.table}>
                {visaTypes.map((visa, index) => (
                  <View key={index} style={styles.tableCard}>
                    <View style={styles.tableCardHeader}>
                      <Text style={styles.visaType}>{visa.type}</Text>
                      <Text style={styles.visaDescription}>{visa.description}</Text>
                    </View>
                    <View style={styles.tableCardContent}>
                      <Text style={styles.durationLabel}>Duration:</Text>
                      <Text style={styles.durationValue}>{visa.duration}</Text>
                    </View>
                  </View>
                ))}
              </View>

              <View style={styles.card}>
                <Text style={styles.cardTitle}>
                  <Icon name="info" size={16} color="#3182ce" /> Key Notes
                </Text>
                <View style={styles.list}>
                  {[
                    'Your I-20 determines legal stay, not the visa stamp',
                    'F-1 students get 60-day grace period after program',
                    'OPT extends stay by 1-3 years',
                    'Always check I-94 for official admission period'
                  ].map((item, index) => (
                    <View key={index} style={styles.listItem}>
                      <View style={[styles.listBullet, { backgroundColor: '#3182ce' }]} />
                      <Text style={styles.listText}>{item}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          )}

          {activeTab === 'renewal' && (
            <View>
              <Text style={styles.sectionTitle}>Visa Renewal Process</Text>
              <Text style={styles.sectionSubtitle}>Follow these steps to renew your visa</Text>
              
              <View style={styles.stepsContainer}>
                {renewalSteps.map((step) => (
                  <TouchableOpacity key={step.step} style={styles.stepCard}>
                    <View style={styles.stepNumber}>
                      <Text style={styles.stepNumberText}>{step.step}</Text>
                    </View>
                    <View style={styles.stepContent}>
                      <Text style={styles.stepTitle}>{step.title}</Text>
                      <Text style={styles.stepDescription}>{step.description}</Text>
                    </View>
                    <Icon name="chevron-right" size={20} color="#cbd5e0" />
                  </TouchableOpacity>
                ))}
              </View>

              <View style={[styles.card, { marginTop: 16 }]}>
                <Text style={styles.cardTitle}>
                  <Icon name="info" size={16} color="#805ad5" /> Tips for Nepali Students
                </Text>
                <View style={styles.list}>
                  {[
                    'Renew in Nepal during breaks (3-4 weeks processing)',
                    'Show strong ties to Nepal (family, property, etc.)',
                    'Carry original bank statements',
                    'Prepare to explain academic difficulties',
                    'Third-country renewals are possible but riskier'
                  ].map((item, index) => (
                    <View key={index} style={styles.listItem}>
                      <View style={[styles.listBullet, { backgroundColor: '#805ad5' }]} />
                      <Text style={styles.listText}>{item}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  container: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0'
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#2A4365',
    margin: 0
  },
  subtitle: {
    color: '#718096',
    fontSize: 14,
    margin: 0,
    opacity: 0.9
  },
  tabSwitcher: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0'
  },
  mobileTab: {
    padding: 12,
    alignItems: 'center'
  },
  mobileTabText: {
    fontSize: 14,
    color: '#718096',
    fontWeight: '500'
  },
  activeMobileTabText: {
    fontSize: 14,
    color: '#2A4365',
    fontWeight: '600'
  },
  tabIndicator: {
    height: 3,
    backgroundColor: '#2A4365',
    width: '100%',
    marginTop: 8,
    borderRadius: 2
  },
  desktopTabs: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
    gap: 8,
  },
  tab: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  activeTab: {
    backgroundColor: '#2A4365',
    borderColor: '#2A4365',
  },
  tabText: {
    fontSize: 14,
    color: '#4a5568',
  },
  activeTabText: {
    color: 'white',
  },
  content: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 20
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2A4365',
    marginBottom: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0'
  },
  sectionSubtitle: {
    color: '#718096',
    fontSize: 14,
    marginBottom: 20
  },
  cardGroup: {
    gap: 16,
    marginBottom: 20
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
    borderLeftWidth: 4,
    borderLeftColor: '#2A4365'
  },
  doCard: {
    borderLeftColor: '#38a169'
  },
  dontCard: {
    borderLeftColor: '#e53e3e'
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    color: '#2d3748'
  },
  list: {
    paddingLeft: 0,
    margin: 0,
  },
  listItem: {
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  listBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#38a169',
    marginTop: 6,
  },
  listText: {
    fontSize: 14,
    color: '#4a5568',
    flex: 1,
  },
  noteBox: {
    backgroundColor: '#fffaf0',
    borderLeftWidth: 4,
    borderLeftColor: '#dd6b20',
    padding: 14,
    borderRadius: 8,
    marginVertical: 20,
  },
  noteText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#718096'
  },
  table: {
    gap: 12,
    marginBottom: 20
  },
  tableCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#e2e8f0'
  },
  tableCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8
  },
  visaType: {
    fontWeight: 'bold',
    color: '#2A4365',
    fontSize: 16
  },
  visaDescription: {
    color: '#718096',
    fontSize: 14
  },
  tableCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  durationLabel: {
    fontWeight: '500',
    color: '#4a5568',
    fontSize: 14
  },
  durationValue: {
    color: '#2d3748',
    fontSize: 14
  },
  stepsContainer: {
    gap: 12,
    marginBottom: 20
  },
  stepCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
    borderLeftWidth: 4,
    borderLeftColor: '#2A4365'
  },
  stepNumber: {
    backgroundColor: '#2A4365',
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  stepContent: {
    flex: 1
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2A4365',
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 14,
    color: '#4a5568',
  },
});

export default VisaPage;