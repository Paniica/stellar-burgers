import { useState, useRef, useEffect, FC, useMemo } from 'react';
import { useInView } from 'react-intersection-observer';

import { IngredientCategory } from '@utils-types';
import { BurgerIngredientsUI } from '../ui/burger-ingredients';
import { useSelector } from '../../services/store';
import { selectIngredients } from '@selectors/ingredients';

export const BurgerIngredients: FC = () => {
  // Получаем ингредиенты и группируем по категориям
  const items = useSelector(selectIngredients);
  const buns = useMemo(
    () => items.filter((item) => item.type === 'bun'),
    [items]
  );
  const mains = useMemo(
    () => items.filter((item) => item.type === 'main'),
    [items]
  );
  const sauces = useMemo(
    () => items.filter((item) => item.type === 'sauce'),
    [items]
  );

  const [activeTab, setActiveTab] = useState<IngredientCategory>('bun');
  const bunTitleRef = useRef<HTMLHeadingElement>(null);
  const mainTitleRef = useRef<HTMLHeadingElement>(null);
  const sauceTitleRef = useRef<HTMLHeadingElement>(null);

  const [bunSectionRef, isBunInView] = useInView({
    threshold: 0
  });

  const [mainSectionRef, isMainInView] = useInView({
    threshold: 0
  });

  const [sauceSectionRef, isSauceInView] = useInView({
    threshold: 0
  });

  useEffect(() => {
    if (isBunInView) {
      setActiveTab('bun');
    } else if (isSauceInView) {
      setActiveTab('sauce');
    } else if (isMainInView) {
      setActiveTab('main');
    }
  }, [isBunInView, isMainInView, isSauceInView]);

  const handleTabClick = (tab: string) => {
    setActiveTab(tab as IngredientCategory);
    if (tab === 'bun')
      bunTitleRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (tab === 'main')
      mainTitleRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (tab === 'sauce')
      sauceTitleRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <BurgerIngredientsUI
      currentTab={activeTab}
      buns={buns}
      mains={mains}
      sauces={sauces}
      titleBunRef={bunTitleRef}
      titleMainRef={mainTitleRef}
      titleSaucesRef={sauceTitleRef}
      bunsRef={bunSectionRef}
      mainsRef={mainSectionRef}
      saucesRef={sauceSectionRef}
      onTabClick={handleTabClick}
    />
  );
};
