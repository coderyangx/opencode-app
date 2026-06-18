import { useState, useTransition } from 'react';

const Children = () => {
  // useTransition is a React Hook that lets you render a part of the UI in the background
  const [isPending, startTransition] = useTransition();

  const [tab, setTab] = useState('about');

  function selectTab(nextTab) {
    startTransition(() => {
      setTab(nextTab);
    });
  }

  return <div>Children 子路由</div>;
};

export default Children;
