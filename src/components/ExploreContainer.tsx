import './ExploreContainer.css';
import { sync, reload } from '@capacitor/live-updates';
import { IonButton, IonCard, IonCardContent } from '@ionic/react';
import { useState } from 'react';

interface ContainerProps { }

const ExploreContainer: React.FC<ContainerProps> = () => {
  const [syncResp, setSyncResp] = useState<string>('')
  return (
    <div id="container">
      <IonCard>
        <IonCardContent>
          <strong>Differential live update - 0.0.2</strong>
          <IonButton 
            onClick={async () => setSyncResp(JSON.stringify(await sync()))} 
            style={{ display: 'flex', justifyContent: 'center'}}
          >
            Sync
          </IonButton>
          {syncResp && (<pre style={{ overflowWrap: 'normal' }}>
            {syncResp}
          </pre>)}
          <IonButton 
            onClick={async () => { reload(); setSyncResp('') }} 
            style={{ display: 'flex', justifyContent: 'center'}}
          >
            Reload
          </IonButton>
        </IonCardContent>
      </IonCard>
      
    </div>
  );
};

export default ExploreContainer;
