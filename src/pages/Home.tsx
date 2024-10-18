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
  IonToast,
  IonText,
  IonInput,
  ToastOptions,
  IonAlert,
} from '@ionic/react';
import { 
  sync, 
  reload, 
  getConfig, 
  setConfig, 
  resetConfig, 
  SyncResult, 
  LiveUpdateConfig,
} from '@capacitor/live-updates';
import { AppInfo, App } from '@capacitor/app'
import { Device, DeviceInfo } from '@capacitor/device';
import { useState, useEffect } from 'react';
import packageJson from '../../package.json';
import './Home.css';

interface Toast {
  open: boolean
  text: string
  color: ToastOptions['color']
}

const Home: React.FC = () => {
  const [channel, setChannel] = useState<string>('');
  const [appInfo, setAppInfo] = useState<AppInfo | undefined>(undefined);
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo | undefined>(undefined);
  const [liveUpdateConfig, setLiveUpdateConfig] = useState<LiveUpdateConfig | undefined>(undefined);
  const [appId, setAppId] = useState<string>('');
  const [strategy, setStrategy] = useState<string>('');
  const [downloadProgress, setDownloadProgress] = useState<number>(0);
  const [syncResp, setSyncResp] = useState<SyncResult | null>(null);
  const [toast, setToast] = useState<Toast>({ open: false, text: '', color: 'primary' });
  const [updateAlertOpen, setUpdateAlertOpen] = useState<boolean>(false);

  useEffect(() => {
    checkForUpdate();
    updateConfigState();
  }, [])

  const performAutomaticSync = async (): Promise<void> => {
    const result = await sync();
    localStorage.updateJustDownloaded = result.activeApplicationPathChanged;
    localStorage.shouldReloadApp = result.activeApplicationPathChanged;
  }

  const dismissUpdateAlert = (): void => {
    localStorage.updateJustDownloaded = 'false';
    setUpdateAlertOpen(false);
  }

  const checkForUpdate = async (): Promise<void> => {
    App.addListener('resume', async () => {
      if (localStorage.updateJustDownloaded === 'true') {
        setUpdateAlertOpen(true)
      }
      if (localStorage.shouldReloadApp === 'true') {
        await reload();
      }
      else {
        await performAutomaticSync();
      }
    });
    
    await performAutomaticSync();
  }

  const updateConfigState = async (): Promise<void> => {
    const config = await getConfig();
    setLiveUpdateConfig(config);
    setAppId(config?.appId || 'Not set');
    setChannel(config?.channel || 'Not set');
    setStrategy(config?.strategy || 'Not set');

    setDeviceInfo(await Device.getInfo());
    setAppInfo(await App.getInfo());
  }

  const handleSync = async (): Promise<void> => {
    const resp = await sync((percentage: number) => {
      setDownloadProgress(percentage);
    })
    setSyncResp(resp);
  }

  const handleConfigUpdate = async (): Promise<void> => {
    if (strategy !== 'zip' && strategy !== 'differential') {
      setToast({
        open: true,
        text: 'Strategy must be "zip" or "differential"',
        color: 'danger',
      });
      return;
    }

    const normalizedStrategy = strategy === 'zip' || strategy === 'differential' ? strategy : undefined;
    await setConfig({ channel, appId, strategy: normalizedStrategy });
    await updateConfigState();
    setToast({
      open: true,
      text: 'Updated live update config successfully',
      color: 'success',
    });
  }

  const handleConfigReset = async (): Promise<void> => {
    await resetConfig();
    await updateConfigState();
  }

  const convertBytes = (bytes: number | undefined): string => {
    if (bytes === 0) return '0 bytes';
    if (!bytes) return 'n/a';
    const sizes = ['bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    if (i === 0) return `${bytes} ${sizes[i]})`;
    return `${(bytes / (1024 ** i)).toFixed(1)} ${sizes[i]}`;
  }

  const parseiOSVersion = (v: number | undefined): string => {
    if (v === undefined) return 'n/a'
    const s = v.toString()
    return `${parseInt(s.slice(0, 2))}.${parseInt(s.slice(2, 4))}.${parseInt(s.slice(4, 6))}`
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
            <IonCardTitle>App Info</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonText><h2><b>Bundle ID:</b> {appInfo?.id || 'Not set'}</h2></IonText>
            <IonText><h2><b>Native version ID:</b> {appInfo?.build || 'Not set'}</h2></IonText>
            <IonText><h2><b>Native version string:</b> {appInfo?.version || 'Not set'}</h2></IonText>
            <IonText><h2><b>Web version:</b> {packageJsonVersion}</h2></IonText>
          </IonCardContent>
        </IonCard>

        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Device Info</IonCardTitle>
          </IonCardHeader>
            <IonCardContent>
            <IonText><h2><b>Platform:</b> {deviceInfo?.platform || 'Not set'}</h2></IonText>
            {deviceInfo?.platform === 'ios' && (
              <IonText><h2><b>iOS version:</b> {parseiOSVersion(deviceInfo?.iOSVersion) || 'Not set'}</h2></IonText>
            )}
            {deviceInfo?.platform === 'android' && (
              <IonText><h2><b>Android SDK version:</b> {deviceInfo?.androidSDKVersion || 'Not set'}</h2></IonText>
            )}
            {['ios', 'android'].includes(deviceInfo?.platform || '') && (
              <IonText><h2><b>Free space:</b> {convertBytes(deviceInfo?.realDiskFree)}</h2></IonText>
            )}
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
            <IonCardTitle>Sync Live Update</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            {(downloadProgress > 0 && downloadProgress < 1) && (
              <IonText>
                {Math.round(downloadProgress * 100)}% downloaded.
              </IonText>
            )}
            {(syncResp?.activeApplicationPathChanged && syncResp?.snapshot?.buildId) && (
              <IonText>
                Downloaded build id {syncResp?.snapshot?.buildId} from {syncResp?.liveUpdate?.channel} channel.
              </IonText>
            )}
            {(!syncResp?.activeApplicationPathChanged && syncResp?.snapshot?.buildId && syncResp?.source === 'cache') && (
              <IonText>
                Pulled build id {syncResp?.snapshot?.buildId} from cache.
              </IonText>
            )}
            {(syncResp?.activeApplicationPathChanged === false && !syncResp?.snapshot?.buildId) && (
              <IonText>
                No live update available on the {syncResp?.liveUpdate?.channel} channel.
              </IonText>
            )}
            {syncResp && (
              <pre style={{ overflow: 'auto', textAlign: 'left', display: 'inline-block' }}>
                {JSON.stringify(syncResp, null, 2)}
              </pre>
            )}
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
        isOpen={toast.open}
        message={toast.text}
        onDidDismiss={() => setToast({ open: false, text: '', color: 'primary' })}
        duration={5000}
        color={toast.color}
      ></IonToast>
      <IonAlert
        trigger="present-alert"
        header="Update applied!"
        message="An update was just applied."
        isOpen={updateAlertOpen}
        buttons={[{
          text: 'OK',
          role: 'confirm',
          handler: () => dismissUpdateAlert()
        }]}
        onDidDismiss={() => dismissUpdateAlert()}
      ></IonAlert>
    </IonPage>
  );
};

export default Home;