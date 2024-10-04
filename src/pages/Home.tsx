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
  IonToast,
  IonText,
  IonInput,
} from '@ionic/react';
import { sync, reload, getConfig, setConfig, resetConfig, SyncResult, LiveUpdateConfig } from '@capacitor/live-updates';
import { useState, useEffect } from 'react';
import './Home.css';

const Home: React.FC = () => {
  const [syncResp, setSyncResp] = useState<SyncResult | null>(null);
  const [channel, setChannel] = useState<string>('');
  const [appId, setAppId] = useState<string>('');
  const [strategy, setStrategy] = useState<string>('');
  const [liveUpdateConfig, setLiveUpdateConfig] = useState<LiveUpdateConfig>({ appId: 'Not set', channel: 'Not set'})
  const [toastOpen, setToastOpen] = useState<boolean>(false);
  const [count, setCount] = useState<number>(0);
  const [downloadProgress, setDownloadProgress] = useState<number>(0);

  useEffect(() => {
    updateConfigState();
  }, [])

  const updateConfigState = async () => {
    const config = await getConfig();
    setLiveUpdateConfig(config);
    setAppId(config?.appId || 'Not set');
    setChannel(config?.channel || 'Not set');
    setStrategy(config?.strategy || 'Not set');
  }

  const handleSync = async () => {
    const resp = await sync((percentage: number) => {
      setDownloadProgress(percentage);
    })
    setSyncResp(resp);
  }

  const handleConfigUpdate = async () => {
    const normalizedStrategy = strategy === 'zip' || strategy === 'differential' ? strategy : undefined;
    await setConfig({ channel, appId, strategy: normalizedStrategy });
    updateConfigState();
    setToastOpen(true)
  }

  const handleConfigReset = async () => {
    await resetConfig();
    await updateConfigState();
  }

  const VERSION = '6.0.1'

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
        <IonContent>
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
              <IonCardTitle>Set Config</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonInput
                label='App ID'
                labelPlacement='stacked'
                placeholder={liveUpdateConfig?.appId || 'Not set'}
                value={appId}
                onIonInput={(e) => setAppId(e.target?.value?.toString() || '')}
              ></IonInput>
              <IonInput
                label='Channel'
                labelPlacement='stacked'
                placeholder={liveUpdateConfig?.channel || 'Not set'}
                value={channel}
                onIonInput={(e) => setChannel(e.target?.value?.toString() || '')}
              />
              <IonInput
                label='Strategy'
                labelPlacement='stacked'
                placeholder={liveUpdateConfig?.strategy || 'Not set'}
                value={strategy}
                onIonInput={(e) => setStrategy(e.target?.value?.toString() || '')}
              />
              <IonButton
                onClick={handleConfigUpdate}
                style={{ display: 'flex'}}
              >
                Save Config
              </IonButton>
              <IonButton
                onClick={handleConfigReset}
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
              {(downloadProgress > 0 && downloadProgress < 1) && (
                <IonText>
                  {Math.round(downloadProgress * 100)}% downloaded.
                </IonText>
              )}
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
        </IonContent>
      
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