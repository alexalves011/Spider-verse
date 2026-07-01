"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";

import HeroDetails from "../HeroDetails";
import HeroPicture from "../HeroPicture";

import styles from "./carousel.module.scss";

import { IHeroData } from "@/src/interface/heroes";

interface IProps {
  heroes: IHeroData[];
  activeId: string;
}

enum enPosition {
  FRONT = 0,
  MIDDLE = 1,
  BACK = 2,
}

export default function Carousel({ heroes, activeId }: IProps) {
  const [visibleItems, setVisibleItems] = useState<IHeroData[] | null>(null);
  const [activeIdex, setActiveIdex] = useState<number>(
    heroes.findIndex((hero) => hero.id === activeId) - 1,
  );

  // mobile behaviour
  const [isMobile, setIsMobile] = useState(false);
  const [mobileIndex, setMobileIndex] = useState<number>(
    Math.max(
      0,
      heroes.findIndex((h) => h.id === activeId),
    ),
  );

  const currentHero = heroes[mobileIndex] ?? heroes[0];

  const [startInteractionPosition, setStartInteractionPosition] = useState<
    number | null
  >(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const ignoreHorizontalRef = useRef(false);
  const [dragStartX, setDragStartX] = useState<number | null>(null);
  const [dragOffset, setDragOffset] = useState<number>(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const animationDuration = 500; // ms (between 400-700)

  const transitionAudio = useMemo(() => new Audio("/songs/transition.mp3"), []);

  const voicesAudio: Record<string, HTMLAudioElement> = useMemo(
    () => ({
      "spider-man-616": new Audio("/songs/spider-man-616.mp3"),
      "mulher-aranha-65": new Audio("/songs/mulher-aranha-65.mp3"),
      "spider-man-1610": new Audio("/songs/spider-man-1610.mp3"),
      "sp-dr-14512": new Audio("/songs/sp-dr-14512.mp3"),
      "spider-ham-8311": new Audio("/songs/spider-ham-8311.mp3"),
      "spider-man-90214": new Audio("/songs/spider-man-90214.mp3"),
      "spider-man-928": new Audio("/songs/spider-man-928.mp3"),
    }),
    [],
  );

  useEffect(() => {
    const indexInArrayScope =
      ((activeIdex % heroes.length) + heroes.length) % heroes.length;

    const visibleItems = [...heroes, ...heroes].slice(
      indexInArrayScope,
      indexInArrayScope + 3,
    );

    setVisibleItems(visibleItems);
  }, [heroes, activeIdex]);

  // detect mobile breakpoint and listen for changes
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(max-width: 768px)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    try {
      mq.addEventListener("change", handler);
    } catch (err) {
      // fallback
      // @ts-ignore
      mq.addListener(handler);
    }
    return () => {
      try {
        mq.removeEventListener("change", handler);
      } catch (err) {
        // @ts-ignore
        mq.removeListener(handler);
      }
    };
  }, []);

  // sync mobileIndex when navigation provides an activeId
  useEffect(() => {
    const idx = Math.max(
      0,
      heroes.findIndex((h) => h.id === activeId),
    );
    setMobileIndex(idx);
  }, [activeId, heroes]);

  useEffect(() => {
    const htmlEl = document.querySelector("html");

    if (!htmlEl) return;

    if (isMobile) {
      const current = heroes[mobileIndex];
      if (current) {
        htmlEl.style.backgroundImage = `url("/spiders/${current.id}-background.png")`;
        htmlEl.classList.add("hero-page");
      }
      return () => {
        htmlEl.classList.remove("hero-page");
      };
    }

    if (!visibleItems) return;

    const currentHeroid = visibleItems[enPosition.MIDDLE].id;
    htmlEl.style.backgroundImage = `url("/spiders/${currentHeroid}-background.png")`;
    htmlEl.classList.add("hero-page");

    return () => {
      htmlEl.classList.remove("hero-page");
    };
  }, [visibleItems, isMobile, mobileIndex, heroes]);

  useEffect(() => {
    if (isMobile) {
      const current = heroes[mobileIndex];
      if (!current) return;
      transitionAudio.play();
      const voiceAudio = voicesAudio[current.id];
      if (!voiceAudio) return;
      voiceAudio.volume = 0.3;
      voiceAudio.play();
      return;
    }

    if (!visibleItems) return;

    transitionAudio.play();

    const voiceAudio = voicesAudio[visibleItems[enPosition.MIDDLE].id];

    if (!voiceAudio) return;

    voiceAudio.volume = 0.3;
    voiceAudio.play();
  }, [
    visibleItems,
    transitionAudio,
    voicesAudio,
    isMobile,
    mobileIndex,
    heroes,
  ]);

  // Parallax effect for mobile adapted to horizontal movement
  useEffect(() => {
    if (!isMobile) return;
    if (typeof window === "undefined") return;

    const wrapper = wrapperRef.current;
    const htmlEl = document.querySelector("html");
    if (!wrapper || !htmlEl) return;

    let ticking = false;

    const slides = Array.from(
      wrapper.querySelectorAll(`.${styles.mobileSlide}`),
    ) as HTMLElement[];

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const vw = window.innerWidth || 1;
        const viewportCenter = window.innerWidth / 2;

        slides.forEach((slide, idx) => {
          const rect = slide.getBoundingClientRect();
          const slideCenter = rect.left + rect.width / 2;
          const progress = (viewportCenter - slideCenter) / vw; // -1..1

          const heroVisual = slide.querySelector(
            `.${styles.mobileHeroVisual}`,
          ) as HTMLElement | null;
          const textEl = slide.querySelector(
            `.${styles.mobileSlideDetails}`,
          ) as HTMLElement | null;

          // background slight shift horizontally
          const bgOffset = (idx - mobileIndex) * 8 + progress * 12; // subtle per-slide + scroll
          htmlEl.style.backgroundPosition = `${bgOffset}px center`;

          if (heroVisual) {
            const translateX = progress * -30; // hero moves opposite to swipe slightly
            const scale = 1 + Math.min(Math.abs(progress) * 0.06, 0.06);
            heroVisual.style.willChange = "transform,opacity";
            heroVisual.style.transform = `translateX(${translateX}px) scale(${scale})`;
            heroVisual.style.opacity = `${1 - Math.min(Math.abs(progress) * 0.25, 0.25)}`;
          }

          if (textEl) {
            const delayed = progress * 0.6;
            const translateXText = delayed * 14; // smaller movement
            textEl.style.willChange = "transform,opacity";
            textEl.style.transform = `translateX(${translateXText}px)`;
            textEl.style.opacity = `${1 - Math.min(Math.abs(delayed) * 0.2, 0.2)}`;
          }
        });

        ticking = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    // also update while touching the wrapper (drag)
    try {
      wrapper.addEventListener("touchmove", onScroll, { passive: false });
    } catch (err) {
      // ignore
    }
    // also call once to initialize
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      try {
        wrapper.removeEventListener("touchmove", onScroll);
      } catch (err) {
        // ignore
      }
      slides.forEach((slide) => {
        const heroVisual = slide.querySelector(
          `.${styles.mobileHeroVisual}`,
        ) as HTMLElement | null;
        const textEl = slide.querySelector(
          `.${styles.mobileSlideDetails}`,
        ) as HTMLElement | null;
        if (heroVisual) {
          heroVisual.style.transform = "";
          heroVisual.style.opacity = "";
          heroVisual.style.willChange = "";
        }
        if (textEl) {
          textEl.style.transform = "";
          textEl.style.opacity = "";
          textEl.style.willChange = "";
        }
      });
      htmlEl.style.backgroundPosition = "";
    };
  }, [isMobile, mobileIndex]);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    if (isMobile) return;
    setStartInteractionPosition(e.clientX as unknown as number);
  };

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    if (isMobile) return;
    if (!startInteractionPosition) return null;
    handleChangeDragTouch(e.clientX as unknown as number);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isMobile) {
      const p = e.touches[0].clientX;
      setStartInteractionPosition(p);
      return;
    }

    // if touch starts inside the details area, allow native vertical scrolling there
    const target = e.target as HTMLElement | null;
    if (target) {
      const detailsEl = target.closest(
        `.${styles.mobileSlideDetails}`,
      ) as HTMLElement | null;
      if (detailsEl) {
        ignoreHorizontalRef.current = true;
        return;
      }
    }

    if (isAnimating) return;
    ignoreHorizontalRef.current = false;
    setDragStartX(e.touches[0].clientX);
    setDragOffset(0);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isMobile) return;
    // if the touch started inside the details area, allow native vertical scroll
    if (ignoreHorizontalRef.current) return;
    if (dragStartX === null || isAnimating) return;
    const currentX = e.touches[0].clientX;
    const deltaX = currentX - dragStartX;
    // prevent native scroll while interacting
    e.preventDefault();
    setDragOffset(deltaX);
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isMobile) {
      if (startInteractionPosition === null) return null;
      const p = e.changedTouches[0].clientX;
      handleChangeDragTouch(p);
      return;
    }

    if (ignoreHorizontalRef.current) {
      ignoreHorizontalRef.current = false;
      return;
    }

    if (dragStartX === null || isAnimating) return;
    const endX = e.changedTouches[0].clientX;
    const deltaX = endX - dragStartX;
    const threshold = Math.max(60, window.innerWidth * 0.12); // px

    // lock animations
    if (Math.abs(deltaX) < threshold) {
      // snap back
      setIsAnimating(true);
      setDragOffset(0);
      // release after duration in case transitionend not fired
      setTimeout(() => setIsAnimating(false), animationDuration + 50);
    } else {
      if (deltaX < 0) {
        // swipe left -> next
        setIsAnimating(true);
        setMobileIndex((s) => Math.min(s + 1, heroes.length - 1));
      } else {
        // swipe right -> prev
        setIsAnimating(true);
        setMobileIndex((s) => Math.max(s - 1, 0));
      }
      setDragOffset(0);
      // release after duration in case transitionend not fired
      setTimeout(() => setIsAnimating(false), animationDuration + 50);
    }

    setDragStartX(null);
    ignoreHorizontalRef.current = false;
  };

  const handleChangeDragTouch = (clientPos: number) => {
    if (startInteractionPosition === null) return;
    const diff = clientPos - startInteractionPosition;
    const threshold = 50;
    if (Math.abs(diff) < threshold) {
      setStartInteractionPosition(null);
      return;
    }
    const newPosition = diff > 0 ? -1 : 1;
    handleChangeActiveIdex(newPosition);
    setStartInteractionPosition(null);
  };

  const handleChangeActiveIdex = (newDirection: number) => {
    setActiveIdex((prevActiveIdex) => prevActiveIdex + newDirection);
  };

  if (!visibleItems) {
    return null;
  }

  return (
    <div className={styles.container}>
      <div className={styles.carousel}>
        <div
          ref={wrapperRef}
          className={styles.wrapper}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {isMobile ? (
            <div
              className={styles.mobileSlides}
              onTransitionEnd={() => setIsAnimating(false)}
              style={{
                transform: `translateX(${dragOffset}px)`,
                transition: isAnimating
                  ? `transform ${animationDuration}ms cubic-bezier(0.22,0.8,0.3,1)`
                  : "none",
              }}
            >
              <section className={styles.mobileSlide} data-active="true">
                <div className={styles.mobileSlideInner}>
                  <div className={styles.mobileHeroVisual}>
                    <HeroPicture hero={currentHero} isCarousel />
                  </div>
                  <div className={styles.mobileSlideDetails}>
                    <HeroDetails data={currentHero} />
                  </div>
                </div>
              </section>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {visibleItems.map((item, position) => (
                <motion.div
                  key={item.id}
                  className={styles.hero}
                  // ... (seus props iniciais)
                  animate={{ x: 0, ...getItemStyles(position) }}
                >
                  {/* REMOVA a prop isCarousel se ela estiver restringindo o tamanho */}
                  <HeroPicture hero={item} />
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>
      {!isMobile && (
        <motion.div
          className={styles.details}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 2 }}
        >
          <HeroDetails data={visibleItems[enPosition.MIDDLE]} />
        </motion.div>
      )}
    </div>
  );
}

const getItemStyles = (position: enPosition) => {
  if (position === enPosition.FRONT) {
    return {
      zIndex: 3,
      filter: "blur(10px)",
      scale: 1.2,
    };
  }

  if (position === enPosition.MIDDLE) {
    return {
      zIndex: 2,
      left: 300,
      scale: 0.8,
      top: "-10px",
    };
  }

  return {
    zIndex: 1,
    filter: "blur(10px)",
    left: 160,
    top: "-20%",
    scale: 0.6,
    opacity: 0.8,
  };
};
