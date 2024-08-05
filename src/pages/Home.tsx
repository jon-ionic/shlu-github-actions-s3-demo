import { 
  IonContent, 
  IonHeader, 
  IonPage, 
  IonTitle, 
  IonToolbar,
  IonCardHeader,
  IonCardContent,
  IonCard,
  IonSelect,
  IonCardTitle,
  IonSelectOption,
  IonButton,
  IonToast,
  IonText,
} from '@ionic/react';
import { sync, reload, SyncResult } from '@capacitor/live-updates';
import { useState } from 'react';
import './Home.css';

const Home: React.FC = () => {
  const [syncResp, setSyncResp] = useState<SyncResult | null>(null);
  const [toastOpen, setToastOpen] = useState<boolean>(false);
  const [count, setCount] = useState<number>(0);
  const [downloadProgress, setDownloadProgress] = useState<number>(0);
  
  const handleSync = async () => {
    try {
      const resp = await sync()
      console.log('sync completed')
      console.log({syncResponse: resp})
      setSyncResp(resp)
    } catch (e) {
      console.log(e)
    }
  }

  const VERSION = '0.0.1'

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Capacitor Live Updates</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Capacitor Live Updates</IonTitle>
          </IonToolbar>
        </IonHeader>
        <div id='container'>
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>Count: {count}</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonButton 
                onClick={() => setCount((prev: number) => prev + 1)} 
                style={{ display: 'flex', justifyContent: 'center'}}
              >
                Increment
              </IonButton>
            </IonCardContent>
          </IonCard>

          <IonCard>
            <IonCardHeader>
              <IonCardTitle>Sync Live Update (current version {VERSION})</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              {downloadProgress > 0 && (
                <IonText>
                  {downloadProgress}% downloaded.
                </IonText>
              )}
              {syncResp && (<pre style={{ overflowWrap: 'normal', textAlign: 'left', display: 'inline-block' }}>
                {JSON.stringify(syncResp, null, 2)}
              </pre>)}
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
                onClick={async () => { reload(); setSyncResp(null) }} 
                style={{ display: 'flex', justifyContent: 'center'}}
              >
                Reload
              </IonButton>
            </IonCardContent>
          </IonCard>
        </div>
      
        <IonToast
          isOpen={toastOpen}
          message='Live update config set successfully.'
          onDidDismiss={() => setToastOpen(false)}
          duration={5000}
        ></IonToast>
      </IonContent>
    </IonPage>
  );
};

export default Home;
