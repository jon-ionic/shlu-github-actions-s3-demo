import React from 'react';
import { 
  IonContent, 
  IonHeader, 
  IonPage, 
  IonTitle, 
  IonToolbar,
  IonCardHeader,
  IonCardContent,
  IonCard,
  IonCardTitle,
  IonButton,
  IonText,
} from '@ionic/react';

import { LiveUpdateError, syncAll, reload, SyncResult } from '@ionic-enterprise/federated-capacitor';
import { useState } from 'react';
import packageJson from '../../package.json';
import './Home.css';

const Home: React.FC = () => {
  const [syncResults, setSyncResults] = useState<SyncResult[]>([]);
  const [syncErrors, setSyncErrors] = useState<LiveUpdateError[]>([]);
  const [syncComplete, setSyncComplete] = useState<boolean>(false);

  const handleSync = async (): Promise<void> => {
    try {
      console.log("STARTING DOWNLOAD")
      syncAll({
        onAppComplete: (result: SyncResult) => {
          setSyncResults([...syncResults, result]);
        },
        onSyncComplete: () => {
          setSyncComplete(true);
        },
        onError: (error: LiveUpdateError) => {
          setSyncErrors([...syncErrors, error]);
        }
      })
      console.log("FINISHED DOWNLOAD")
    } catch (e) {
      console.log('catch handled:', e)
    }
  }
  const packageJsonVersion = packageJson.version;

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle size="large" id="demo-header">Demo {packageJsonVersion}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Sync Live Update</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            {syncErrors.map((error: LiveUpdateError) => (
              <IonText><h2>Failed to download app ID {error.appId}</h2></IonText>
            ))}
            {syncResults.map((result: SyncResult) => (
              <IonText><h2>Successfully downloaded app ID {result.liveUpdate.appId}</h2></IonText>
            ))}
            {syncComplete && <IonText><h2>Sync complete.</h2></IonText>}
            <IonButton 
              onClick={handleSync}
              style={{ display: 'flex', justifyContent: 'center'}}
            >
              Sync
            </IonButton>
          </IonCardContent>
        </IonCard>

        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Reload App</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonButton 
              onClick={async () => { reload(); }} 
              style={{ display: 'flex', justifyContent: 'center'}}
            >
              Reload
            </IonButton>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default Home;