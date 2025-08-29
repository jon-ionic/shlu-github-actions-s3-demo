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
import { App } from '@capacitor/app';

import { LiveUpdateError, syncAll, syncSome, reload, SyncResult, refreshMicroApps } from '@ionic-enterprise/federated-capacitor';
import { useState } from 'react';
import packageJson from '../../package.json';
import './Home.css';

const Home: React.FC = () => {
  const [syncResults, setSyncResults] = useState<SyncResult[]>([]);
  const [syncErrors, setSyncErrors] = useState<LiveUpdateError[]>([]);
  const [syncComplete, setSyncComplete] = useState<boolean>(false);

  App.addListener('resume', async () => {
    if (localStorage.shouldReloadApp === 'true') {
      console.log('Refreshing MFEs.')
      await refreshMicroApps();
    } else {
      await handleSync();
    }
  });

  const handleSync = async (): Promise<void> => {
    const results: SyncResult[] = [];
    const errors: LiveUpdateError[] = [];

    await syncSome({ appIds: ['e42f72bb', 'df240a48'] }, {
      onAppComplete: (result: SyncResult) => {
        results.push(result);
        setSyncResults([...syncResults, result]);
      },
      onSyncComplete: () => {
        setSyncComplete(true);
        
        const mfesUpdated = results
          .filter((r: SyncResult) => r.activeApplicationPathChanged == true)
          .map((r: SyncResult) => r.liveUpdate.appId);

        if (mfesUpdated.length > 0) {
          console.log(`App IDs ${mfesUpdated.join(", ")} updated. App will reload next on next resume.`);
          localStorage.shouldReloadApp = 'true';
        } else {
          console.log('No apps were updated.');
          localStorage.shouldReloadApp = 'false';
        }
      },
      onError: (error: LiveUpdateError) => {
        errors.push(error);
        setSyncErrors([...syncErrors, error]);
      }
    });
  }
  const packageJsonVersion = packageJson.version;

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle size="large" id="demo-header">Fedcap Demo {packageJsonVersion}</IonTitle>
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