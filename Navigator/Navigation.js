import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Navigation = ({ role, activeTab }) => {
    const navigation = useNavigation();

    const donorTabs = [
        { label: 'Nakdi Bağış', route: 'BagisciAnaMenu' },
        { label: 'Özel Bağış', route: 'BagisciOzelBagis' },
        { label: 'Acil Durumlar', route: 'AcilDurumlar' },
        { label: 'Etkinlikler', route: 'BagisAlanEtkinlikler' }
    ];

    const receiverTabs = [
        { label: 'Yardım Ekranı', route: 'BagisAlanAnaMenu' },
        { label: 'Acil Durumlar', route: 'AcilDurumlar' },
        { label: 'Etkinlikler', route: 'BagisAlanEtkinlikler' }
    ];

    const tabs = role === 'donor' ? donorTabs : receiverTabs;

    return (
        <View style={styles.tabContainer}>
            {tabs.map((tab, index) => (
                <TouchableOpacity
                    key={index}
                    style={[styles.tabButton, activeTab === tab.route && styles.activeTab]}
                    onPress={() => navigation.navigate(tab.route)}
                >
                    <Text style={[styles.tabText, activeTab === tab.route && styles.activeTabText]}>
                        {tab.label}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    tabContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: '#FEF7FF',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    tabButton: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 10,
    },
    activeTab: {
        borderBottomWidth: 2,
        borderBottomColor: '#65558F',
    },
    tabText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#65558F',
    },
    activeTabText: {
        color: '#65558F',
        fontWeight: 'bold',
    },
});

export default Navigation;
