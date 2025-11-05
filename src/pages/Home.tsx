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
  IonToggle,
} from '@ionic/react';
import { 
  sync, 
  reload, 
  getConfig, 
  setConfig, 
  resetConfig, 
  SyncResult, 
  LiveUpdateConfig,
  LiveUpdateError,
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
  const [liveUpdateEnabled, setLiveUpdateEnabled] = useState<boolean>(false)
  const [downloadProgress, setDownloadProgress] = useState<number>(0);
  const [syncResp, setSyncResp] = useState<SyncResult | null>(null);
  const [syncError, setSyncError] = useState<LiveUpdateError | null>(null);
  const [downloadStarted, setDownloadStarted] = useState<boolean>(false);
  const [toast, setToast] = useState<Toast>({ open: false, text: '', color: 'primary' });
  const [updateAlertOpen, setUpdateAlertOpen] = useState<boolean>(false);

  useEffect(() => {
    setConfig({ channel: 'dev-0.0.1' })
    updateConfigState();
  }, [])

 const checkForUpdateOnResume = async (): Promise<void> => {
    /* 
    Example function that automatically downloads and applies a live update on app resume.
    Add to useEffect to automatically trigger on resume.
    */
    const performAutomaticSync = async (): Promise<void> => {
      const result = await sync();
      if (result.activeApplicationPathChanged === true) {
        localStorage.updateJustDownloaded = 'true';
      }
      localStorage.shouldReloadApp = result.activeApplicationPathChanged;
    }

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

    if (localStorage.updateJustDownloaded === 'true') {
      setUpdateAlertOpen(true)
    }
    
    await performAutomaticSync();
  }

  const dismissUpdateAlert = (): void => {
    localStorage.updateJustDownloaded = 'false';
    setUpdateAlertOpen(false);
  }

  const updateConfigState = async (): Promise<void> => {
    /*
    Fetches the plugin values from the live update config and applies them to state.
    Gets run on startup and after updating/resetting the config.
    */
    const config = await getConfig();
    setLiveUpdateConfig(config);
    setAppId(config?.appId || 'Not set');
    setChannel(config?.channel || 'Not set');
    setStrategy(config?.strategy?.toLowerCase() || 'Not set');
    setLiveUpdateEnabled(config?.enabled || false)

    setDeviceInfo(await Device.getInfo());
    setAppInfo(await App.getInfo());
  }

  const handleSync = async (): Promise<void> => {
    try {
      setDownloadStarted(true);
      setSyncError(null);
      const resp = await sync((percentage: number) => {
        console.log(percentage)
        setDownloadProgress(percentage);
      })
      
      setDownloadStarted(false);
      setSyncResp(resp);
    } catch (e: unknown) {
      setDownloadStarted(false);
      function errorIsLiveUpdateError (e: any): e is LiveUpdateError {
        return (
          typeof e.appId === 'string' &&
          e !== null &&
          typeof e.message === 'string' &&
          typeof e.failStep === 'string'
        );
      }

      setSyncResp(null);
      if (errorIsLiveUpdateError(e)) setSyncError(e);
    }
  }

  const handleConfigUpdate = async (): Promise<void> => {
    /*
    Validate and save live update configuration.
    */
    if (strategy !== 'zip' && strategy !== 'differential') {
      setToast({
        open: true,
        text: 'Strategy must be "zip" or "differential"',
        color: 'danger',
      });
      return;
    }

    const normalizedStrategy = strategy === 'zip' || strategy === 'differential' ? strategy : undefined;
    await setConfig({ channel, appId, strategy: normalizedStrategy, enabled: liveUpdateEnabled });
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
          <IonTitle size="large" id="demo-header">Big Live Update #2 - {packageJsonVersion}</IonTitle>
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
            <IonToggle
              checked={liveUpdateEnabled}
              onIonChange={(e) => setLiveUpdateEnabled(e.detail.checked)}
              labelPlacement="stacked"
              alignment="start"
            >Enabled</IonToggle>
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
            {downloadStarted && (
              <IonText>
                Download in progress...
              </IonText>
            )}
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
            {syncError && (
              <IonText>
                {(() => {
                  switch (syncError.failStep) {
                    case 'UNPACK':
                      return ('An error occurred while unpacking an update. ' + 
                        'Please make sure there is sufficient storage on the device.')
                    case 'DOWNLOAD':
                      return ('An error occurred while downloading an update. ' +
                        'Please make sure your device is online.')
                    default:
                      return `An error occurred while downloading an update.`
                  }
                })()}
              </IonText>
            )}
            {syncError && (
              <pre style={{ overflow: 'auto', textAlign: 'left', display: 'inline-block' }}>
                {JSON.stringify(syncError, null, 2)}
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