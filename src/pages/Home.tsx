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
} from '@ionic/react';
import { useState } from 'react';
import './Home.css';

const Home: React.FC = () => {
  const [count, setCount] = useState<number>(0);

  const VERSION = '0.0.1'

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Portal - {VERSION}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Portal - {VERSION}</IonTitle>
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
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;
