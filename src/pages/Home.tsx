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
import { sync, reload, getConfig, setConfig, resetConfig, SyncResult } from '@capacitor/live-updates';
import { useState, useEffect } from 'react';
import { App } from '@capacitor/app';
import './Home.css';

const Home: React.FC = () => {
  const [syncResp, setSyncResp] = useState<SyncResult | null>(null);
  const [channel, setChannel] = useState<string>('');
  const [channelFromConfig, setChannelFromConfig] = useState<string>('');
  const [toastOpen, setToastOpen] = useState<boolean>(false);

  const initializeApp = async () => {
    App.addListener('resume', async () => {
      if (localStorage.shouldReloadApp) await reload();
      else {
        const result = await sync();
        localStorage.shouldReloadApp = result.activeApplicationPathChanged;
      }
    });

    const result = await sync();
    localStorage.shouldReloadApp = result.activeApplicationPathChanged;
  }

  useEffect(() => {
    initializeApp()
  })

  useEffect(() => {
    updateConfigState()
  }, [channel])

  const updateConfigState = async () => {
    const config = await getConfig();
    setChannelFromConfig(config?.channel || '')
  }

  const handleSync = async () => {
    setSyncResp(await sync())
  }

  const handleChannelUpdate = async () => {
    await setConfig({ channel });
    updateConfigState();
    setToastOpen(true)
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
              <IonCardTitle>Select Channel ({channelFromConfig || 'not set'})</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonSelect 
                label="Channel"
                onIonChange={(e) => setChannel(e.detail.value)}
                value={channel}
              >
                {
                  [
                    { label: 'Production', value: 'prod-0.0.1'},
                    { label: 'Development', value: 'dev-0.0.1'},
                  ].map((item: {label: string, value: string}) => (
                    <IonSelectOption value={item.value}>
                      {item.label}
                    </IonSelectOption>)
                  )
                }
              </IonSelect>
              <IonButton
                onClick={handleChannelUpdate}
                style={{ display: 'flex'}}
              >
                Save Channel
              </IonButton>
              <IonButton
                onClick={resetConfig}
                color='danger'
                style={{ display: 'flex'}}
              >Reset Config</IonButton>
            </IonCardContent>
          </IonCard>

          <IonCard>
            <IonCardHeader>
              <IonCardTitle>Sync Live Update (current version {VERSION})</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              {(syncResp?.liveUpdate?.channel && syncResp?.snapshot?.buildId) && (
                <IonText>
                  Downloaded build id {syncResp?.snapshot?.buildId} from {syncResp?.liveUpdate?.channel} channel.
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
