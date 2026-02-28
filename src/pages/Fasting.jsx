import { FastingProvider } from '../hooks/useFasting';
import Timer from '../components/Timer';
import FastingPlanSelector from '../components/FastingPlanSelector';
import Stats from '../components/Stats';
import './Fasting.css';

export default function Fasting() {
  return (
    <FastingProvider>
      <div className='fasting-page'>
        <main className='fasting-main'>
          <Timer />
          <FastingPlanSelector />
          <Stats />
        </main>
      </div>
    </FastingProvider>
  );
}
