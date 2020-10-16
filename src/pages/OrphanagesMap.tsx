import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Dimensions } from 'react-native';

import MapMarker from '../images/map-marker.png'
import { Feather } from '@expo/vector-icons'

import MapView, { Marker, Callout, PROVIDER_GOOGLE } from 'react-native-maps'
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { RectButton } from 'react-native-gesture-handler';

import api from '../services/api'

interface Orphanage {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
}

export default function App() {

  const navigation = useNavigation()

  function handleNavigateToOrphanageDetails(id: number) {
    navigation.navigate('OrphanagesDetails', { id })
  }

  function handleNavigateToCreateOrphanage() {
    navigation.navigate('SelectMapPosition')
  }

  const [orphanage, setOrphanage] = useState<Orphanage[]>([])

  useFocusEffect(() => {

    api.get('orphanage').then(({ data }) => {
      setOrphanage(data)
    })

  }, [])

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          latitude: -21.2979927,
          longitude: -46.7091285,
          latitudeDelta: 0.08,
          longitudeDelta: 0.08
        }}>

        {orphanage.map(orphanage => {

          const { id, name, latitude, longitude } = orphanage

          return (
            <Marker
              key={id}
              icon={MapMarker}
              calloutAnchor={{
                x: 2.9,
                y: 0.8
              }}
              coordinate={{
                latitude,
                longitude
              }}
            >
              <Callout tooltip={true} onPress={() => handleNavigateToOrphanageDetails(id)}>
                <View style={styles.calloutContainer}>
                  <Text style={styles.calloutText}>
                    {name}
                  </Text>
                </View>
              </Callout>
            </Marker>
          )
        })}

      </MapView>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          {orphanage.length} orfanatos encontrados
        </Text>

        <RectButton
          style={styles.createOrphanageButton}
          onPress={handleNavigateToCreateOrphanage}>
          <Feather name="plus" size={20} color="#FFF" />
        </RectButton>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  calloutContainer: {
    width: 168,
    height: 46,
    paddingHorizontal: 16,
    backgroundColor: "rgba(255,255,255,0.8)",
    borderRadius: 16,
    justifyContent: 'center',
  },
  calloutText: {
    fontFamily: 'Nunito_700Bold',
    color: '#0089a5',
    fontSize: 14
  },
  footer: {
    position: 'absolute',
    left: 24,
    right: 24,
    bottom: 32,

    backgroundColor: '#FFF',
    borderRadius: 28,
    height: 56,
    paddingLeft: 24,

    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    elevation: 3,
    shadowColor: 'gray',
    shadowOffset: { height: 2, width: 2 },
    shadowOpacity: 0.7,
    shadowRadius: 2
  },
  footerText: {
    color: '#8fa7b3',
    fontFamily: 'Nunito_700Bold'
  },
  createOrphanageButton: {
    width: 56,
    height: 56,
    backgroundColor: '#15c3d6',
    borderRadius: 20,

    justifyContent: 'center',
    alignItems: "center"
  }
})