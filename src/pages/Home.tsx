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
  ToastOptions,
} from '@ionic/react';
import { LiveUpdate } from '@capawesome/capacitor-live-update'
import { useEffect } from 'react';
import './Home.css';

const Home: React.FC = () => {
  const handleSync = async (bundleId: string): Promise<void> => {
    // check if bundle id was already downloaded
    const { bundleIds = [] } = await LiveUpdate.getBundles()
    if (!bundleIds.includes(bundleId)) {
      await LiveUpdate.downloadBundle({ 
        url: `https://capawesome-test.s3.us-east-1.amazonaws.com/${bundleId}.zip`, 
        bundleId 
      })
    }

    // apply bundle
    await LiveUpdate.setNextBundle({ bundleId })
    await LiveUpdate.reload()
  }

  useEffect(() => {
    const ready = async () => await LiveUpdate.ready()
    ready()
  }, [])

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle size="large" id="demo-header">Base</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Download Live Update</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonButton
              onClick={() => handleSync('1')}
              style={{ display: 'flex', justifyContent: 'center'}}
            >
              Download Bundle #1
            </IonButton>
            <IonButton
              onClick={() => handleSync('2')}
              style={{ display: 'flex', justifyContent: 'center'}}
            >
              Download Bundle #2
            </IonButton>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default Home;