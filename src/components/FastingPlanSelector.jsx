import { useFastingContext } from '../hooks/useFasting';
import { PLANS } from '../constants';
import './FastingPlanSelector.css';

export default function FastingPlanSelector() {
  const { currentPlan, setPlan, isFasting } = useFastingContext();

  const plans = Object.keys(PLANS);

  return (
    <div className='plan-selector'>
      <h3 className='plan-selector-title'>选择断食方案</h3>
      <div className='plan-options'>
        {plans.map((plan) => (
          <button
            key={plan}
            className={`plan-option ${currentPlan === plan ? 'active' : ''} ${isFasting ? 'disabled' : ''}`}
            onClick={() => !isFasting && setPlan(plan)}
            disabled={isFasting}
          >
            <span className='plan-name'>{plan}</span>
            <span className='plan-desc'>
              {PLANS[plan].fastingHours}h 断食 / {PLANS[plan].eatingHours}h 进食
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
