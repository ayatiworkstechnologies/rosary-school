"use client";

import Image from "next/image";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { useRef, useState } from "react";

/* =========================================================
   TYPES
========================================================= */

type TimelineItem = {
  id: number;
  title: string;
  description: string;
  image?: string;
};

/* =========================================================
   DATA
========================================================= */

const timelineItems: TimelineItem[] = [
  {
    id: 1,
    title: "BIRTH OF ROSARY",
    description:
      "9th June 1950 is a significant day in the history of Rosary school as it saw the birth of the institution in response to the wishes of many parents in Madras to give their children education through English medium. The sisters- Franciscan Missionaries of Mary came forward to meet the expressed need of parents. Thus, the Rosary Matriculation School was started. The school has grown from strength to strength over these sixty Two years marking milestones in its journey into the future. A glimpse at the growth of this institution will awaken a spirit of service in us and prepare us for a fruitful life in the years to come.",
    image: "/images/history-01.png",
  },
  {
    id: 2,
    title: "FOUNDER OF THIS INSTITUTION",
    description:
      "The Founder Principal of this institution was Sr. Mary Proinsias FMM in whose tender care the sapling of Rosary began to grow with Truth and Charity as its motto. The pioneers of the infant Rosary School started building up the school facing with courage and determination all the challenges in their onward march. “To whom much is given, from him much will be required”. Yes, the rapid growth and development of the school demanded greater emphasis on the all round development of the child. The high standard of education with discipline set a general tone for the school.",
    image: "/images/history-02.png",
  },
  {
    id: 3,
    title: "DEVELOPING A SPIRIT OF ENQUIRY",
    description:
      "Knowledge is acquired in different ways, both by learning and doing. The well equipped Science Labs make learning enjoyable, developing the spirit of enquiry in the young minds. In keeping with the IT explosion which is monopolizing the modern world, the school has set up a sophisticated computer centre functioning from 13th July 1990. Even the tiny tots of Rosary School derive great delight in operating the ‘magic machine’.",
    image: "/images/history-03.png",
  },
  {
    id: 4,
    title: "OPEN AIR STAGE",
    description:
      "The open air stage is a venue for the exhibition of the children’s talents and a boon to the school. The number of applications through the year add much colour to the student’s life in school. A long cherished dream of an auditorium for all seasons come rain or shine came into reality under the able guidance of Sr. Leena D’Souza FMM when Sr. Merlyn D’Sa FMM the Provincial laid the foundation on 10th November 1990. Its stands as a monument of goodwill of parents, well-wishers and patrons of the school.",
    image: "/images/history-04.png",
  },
  {
    id: 5,
    title: "CO-CURRICULAR ACTIVITIES",
    description:
      "To develop the aesthetics sense and the artistic skills of the students, the school organizes multifarious activities in art, music and dance. Art classes and competitions help tap the talents through various activities. The school choir enlivens every function in the school and dancers add grace to it. Educational trips are a part of the school curriculum and sixty years many useful trips have been organized to places like Kashmir to Cape Comorin the southern tip of India. ‘Live not for ourselves but always for others.’ To live up to this motto, the Rosarians have spent several hours and days in social service activities.",
    image: "/images/history-05.png",
  },
  {
    id: 6,
    title: "BOARDING HOUSE",
    description:
      "The Boarding House opened on 13th June 1962 was indeed a home away from home for the students residing outside Chennai. They were brought together as one family under the motherly care of Sr. Liana FMM. The Boarding House which was renovated some years ago is present called the Palm House – it is the kinder garden section of the school. Today the infrastructure of the school is completed catering to the various needs of the pupils. The Office with its industrious staff, functions as the heart of the institution giving life to every department of the school. The school Library is a magnetic corner of the school drawing towards it students of all ages. Access to books, magazines and newspapers is with the help and guidance of the librarian.",
    image: "/images/history-06.png",
  },
];

/* =========================================================
   MOTION
========================================================= */

const ease = [0.22, 1, 0.36, 1] as const;

/* =========================================================
   IMAGE
========================================================= */

function TimelineImage({
  src,
  alt,
}: {
  src?: string;
  alt: string;
}) {
  const [imageFailed, setImageFailed] = useState(false);

  const showImage = Boolean(src) && !imageFailed;

  return (
    <div
      className="
        group
        relative
        aspect-square
        w-full
        overflow-hidden
        rounded-[6px]
        bg-[#F4F7FA]
        shadow-[0_18px_50px_rgba(20,45,75,0.10)]

        md:max-w-[360px]

        xl:h-[426px]
        xl:w-[426px]
        xl:max-w-none
      "
    >
      {showImage ? (
        <>
          <motion.div
            initial={{ scale: 1.08 }}
            whileInView={{ scale: 1 }}
            viewport={{
              once: true,
              amount: 0.2,
            }}
            transition={{
              duration: 1.6,
              ease,
            }}
            className="absolute inset-0"
          >
            <Image
              src={src!}
              alt={alt}
              width={426}
              height={426}
              loading="lazy"
              onError={() => setImageFailed(true)}
              className="
                h-full
                w-full
                object-cover
                object-center
                transition-transform
                duration-[1300ms]

                group-hover:scale-[1.035]
              "
            />
          </motion.div>

          <div
            className="
              pointer-events-none
              absolute
              inset-0
              bg-gradient-to-t
              from-black/[0.10]
              via-transparent
              to-transparent
            "
          />
        </>
      ) : (
        <div
          className="
            absolute
            inset-0
            flex
            items-center
            justify-center
            bg-gradient-to-br
            from-[#F5FAFF]
            via-white
            to-[#EAF4FE]
          "
        >
          <div
            className="
              absolute
              h-[180px]
              w-[180px]
              rounded-full
              border
              border-[#0075FF]/10
            "
          />

          <div
            className="
              absolute
              h-[120px]
              w-[120px]
              rounded-full
              border
              border-[#0075FF]/[0.06]
            "
          />

          <span
            className="
              relative
              z-10
              rounded-[5px]
              bg-white
              px-[13px]
              py-[8px]
              font-secondary
              text-[11px]
              font-medium
              text-[#0075FF]
              shadow-[0_10px_30px_rgba(0,117,255,0.10)]
            "
          >
            Rosary School
          </span>
        </div>
      )}
    </div>
  );
}

/* =========================================================
   TEXT
========================================================= */

function TimelineText({
  item,
  align = "left",
}: {
  item: TimelineItem;
  align?: "left" | "right";
}) {
  return (
    <div
      className={`
        w-full
        max-w-[430px]

        ${align === "right" ? "xl:text-right" : "xl:text-left"}
      `}
    >
      <span
        className="
          inline-flex
          font-primary
          text-[10px]
          font-semibold
          tracking-[1.7px]
          text-[#0075FF]

          sm:text-[11px]
        "
      >
        {String(item.id).padStart(2, "0")}
      </span>

      <h3
        className="
          mt-[6px]
          font-primary
          text-[20px]
          font-semibold
          leading-[1.2]
          tracking-[-0.35px]
          !text-[#161616]

          sm:text-[22px]

          md:text-[23px]

          xl:text-[19px]
        "
      >
        {item.title}
      </h3>

      <p
        className="
          mt-[11px]
          font-secondary
          text-[13px]
          font-normal
          leading-[1.65]
          text-[#5E5E5E]

          sm:text-[13.5px]

          md:text-[14px]

          xl:text-[13.5px]
          xl:leading-[1.62]
        "
      >
        {item.description}
      </p>
    </div>
  );
}

/* =========================================================
   DESKTOP ROW — 1280+
========================================================= */

function DesktopTimelineRow({
  item,
  index,
}: {
  item: TimelineItem;
  index: number;
}) {
  const imageLeft = index % 2 === 0;

  const rowRef = useRef<HTMLElement | null>(null);

  const { scrollYProgress: rowProgress } = useScroll({
    target: rowRef,
    offset: ["start 62%", "start 46%"],
  });

  const activeProgress = useSpring(rowProgress, {
    stiffness: 130,
    damping: 26,
    mass: 0.28,
  });

  const dotBackground = useTransform(
    activeProgress,
    [0, 0.72, 1],
    ["#FFFFFF", "#FFFFFF", "#0075FF"]
  );

  const dotBorder = useTransform(
    activeProgress,
    [0, 0.72, 1],
    ["#CBD3DD", "#CBD3DD", "#0075FF"]
  );

  const dotRing = useTransform(
    activeProgress,
    [0, 0.72, 1],
    [
      "0 0 0 0px rgba(0,117,255,0)",
      "0 0 0 0px rgba(0,117,255,0)",
      "0 0 0 7px rgba(0,117,255,0.08)",
    ]
  );

  const connectorScale = useTransform(
    activeProgress,
    [0.58, 1],
    [0, 1]
  );

  return (
    <motion.article
      ref={rowRef}
      initial={{
        opacity: 0,
        y: 65,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
        amount: 0.1,
        margin: "0px 0px -80px 0px",
      }}
      transition={{
        duration: 1.05,
        ease,
      }}
      className="
        relative
        hidden
        min-h-[470px]
        grid-cols-[minmax(0,1fr)_76px_minmax(0,1fr)]
        items-start

        xl:grid
      "
    >
      {/* LEFT SIDE */}

      <div
        className="
          flex
          min-w-0
          justify-end
          pr-[44px]
        "
      >
        {imageLeft ? (
          <motion.div
            initial={{
              opacity: 0,
              x: -42,
              rotateY: 6,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
              rotateY: 0,
            }}
            viewport={{
              once: true,
              amount: 0.18,
            }}
            transition={{
              duration: 1.15,
              delay: 0.08,
              ease,
            }}
            style={{
              transformPerspective: 1200,
            }}
          >
            <TimelineImage
              src={item.image}
              alt={item.title}
            />
          </motion.div>
        ) : (
          <motion.div
            initial={{
              opacity: 0,
              x: -36,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            viewport={{
              once: true,
              amount: 0.2,
            }}
            transition={{
              duration: 1.05,
              delay: 0.1,
              ease,
            }}
            className="
              mt-[88px]
              flex
              w-full
              justify-end
            "
          >
            <TimelineText
              item={item}
              align="right"
            />
          </motion.div>
        )}
      </div>

      {/* CENTER AXIS */}

      <div
        className="
          relative
          min-h-[470px]
        "
      >
        <motion.span
          style={{
            backgroundColor: dotBackground,
            borderColor: dotBorder,
            boxShadow: dotRing,
          }}
          className="
            absolute
            left-1/2
            top-[118px]
            z-20
            h-[11px]
            w-[11px]
            -translate-x-1/2
            rounded-full
            border-[2px]
          "
        />

        {/* Connector — neutral first, blue only when progress reaches it */}
        <span
          className={`
            absolute
            top-[122px]
            h-[2px]
            w-[66px]
            bg-[#D9DFE7]

            ${
              imageLeft
                ? "left-1/2"
                : "right-1/2"
            }
          `}
        />

        <motion.span
          style={{
            scaleX: connectorScale,
          }}
          className={`
            absolute
            top-[122px]
            h-[2px]
            w-[66px]
            bg-[#0075FF]

            ${
              imageLeft
                ? "left-1/2 origin-left"
                : "right-1/2 origin-right"
            }
          `}
        />
      </div>

      {/* RIGHT SIDE */}

      <div
        className="
          flex
          min-w-0
          justify-start
          pl-[44px]
        "
      >
        {imageLeft ? (
          <motion.div
            initial={{
              opacity: 0,
              x: 36,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            viewport={{
              once: true,
              amount: 0.2,
            }}
            transition={{
              duration: 1.05,
              delay: 0.1,
              ease,
            }}
            className="
              mt-[88px]
              w-full
            "
          >
            <TimelineText
              item={item}
              align="left"
            />
          </motion.div>
        ) : (
          <motion.div
            initial={{
              opacity: 0,
              x: 42,
              rotateY: -6,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
              rotateY: 0,
            }}
            viewport={{
              once: true,
              amount: 0.18,
            }}
            transition={{
              duration: 1.15,
              delay: 0.08,
              ease,
            }}
            style={{
              transformPerspective: 1200,
            }}
          >
            <TimelineImage
              src={item.image}
              alt={item.title}
            />
          </motion.div>
        )}
      </div>
    </motion.article>
  );
}

/* =========================================================
   MOBILE + TABLET ROW — BELOW 1280
========================================================= */

function CompactTimelineRow({
  item,
  index,
}: {
  item: TimelineItem;
  index: number;
}) {
  const imageFirstOnTablet = index % 2 === 0;

  const rowRef = useRef<HTMLElement | null>(null);

  const { scrollYProgress: rowProgress } = useScroll({
    target: rowRef,
    offset: ["start 68%", "start 50%"],
  });

  const activeProgress = useSpring(rowProgress, {
    stiffness: 130,
    damping: 26,
    mass: 0.28,
  });

  const dotBackground = useTransform(
    activeProgress,
    [0, 0.72, 1],
    ["#FFFFFF", "#FFFFFF", "#0075FF"]
  );

  const dotBorder = useTransform(
    activeProgress,
    [0, 0.72, 1],
    ["#CBD3DD", "#CBD3DD", "#0075FF"]
  );

  const dotRing = useTransform(
    activeProgress,
    [0, 0.72, 1],
    [
      "0 0 0 0px rgba(0,117,255,0)",
      "0 0 0 0px rgba(0,117,255,0)",
      "0 0 0 6px rgba(0,117,255,0.08)",
    ]
  );

  const connectorScale = useTransform(
    activeProgress,
    [0.58, 1],
    [0, 1]
  );

  return (
    <motion.article
      ref={rowRef}
      initial={{
        opacity: 0,
        y: 45,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
        amount: 0.12,
        margin: "0px 0px -60px 0px",
      }}
      transition={{
        duration: 0.95,
        ease,
      }}
      className="
        relative
        pl-[42px]

        xl:hidden
      "
    >
      {/* DOT */}

      <motion.span
        style={{
          backgroundColor: dotBackground,
          borderColor: dotBorder,
          boxShadow: dotRing,
        }}
        className="
          absolute
          left-[10px]
          top-[8px]
          z-20
          h-[11px]
          w-[11px]
          rounded-full
          border-[2px]
        "
      />

      {/* SHORT CONNECTOR — gray first, blue after progress reaches marker */}

      <span
        className="
          absolute
          left-[15px]
          top-[12px]
          h-[2px]
          w-[23px]
          bg-[#D9DFE7]
        "
      />

      <motion.span
        style={{
          scaleX: connectorScale,
        }}
        className="
          absolute
          left-[15px]
          top-[12px]
          h-[2px]
          w-[23px]
          origin-left
          bg-[#0075FF]
        "
      />

      {/* MOBILE: text first, image below
          TABLET: 2-column alternating */}
      <div
        className={`
          grid
          grid-cols-1
          gap-[22px]

          md:grid-cols-2
          md:items-center
          md:gap-[30px]

          ${
            imageFirstOnTablet
              ? ""
              : "md:[&>*:first-child]:order-2 md:[&>*:last-child]:order-1"
          }
        `}
      >
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.15,
          }}
          transition={{
            duration: 0.85,
            ease,
          }}
          className="
            md:flex
            md:justify-center
          "
        >
          <TimelineText item={item} />
        </motion.div>

        <motion.div
          initial={{
            opacity: 0,
            y: 28,
            scale: 0.97,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
            scale: 1,
          }}
          viewport={{
            once: true,
            amount: 0.12,
          }}
          transition={{
            duration: 0.95,
            delay: 0.08,
            ease,
          }}
          className="
            md:flex
            md:justify-center
          "
        >
          <TimelineImage
            src={item.image}
            alt={item.title}
          />
        </motion.div>
      </div>
    </motion.article>
  );
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function HistoryTimeline() {
  const sectionRef =
    useRef<HTMLElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 25%", "end 75%"],
  });

  const smoothProgress =
    useSpring(scrollYProgress, {
      stiffness: 95,
      damping: 24,
      mass: 0.35,
    });

  const timelineFill =
    useTransform(
      smoothProgress,
      [0, 1],
      ["0%", "100%"]
    );

  return (
    <section
      ref={sectionRef}
      className="
        relative
        overflow-hidden
        bg-white

        py-[46px]

        sm:py-[58px]

        xl:py-[80px]
      "
    >
      {/* BACKGROUND */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          bg-[url('/images/full-bg.png')]
          bg-cover
          bg-center
          bg-repeat
          opacity-[0.5]
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          left-1/2
          top-[120px]
          h-[420px]
          w-[420px]
          -translate-x-1/2
          rounded-full
          bg-[#0075FF]/[0.025]
          blur-[120px]
        "
      />

      {/* MAIN CONTAINER */}

      <div
        className="
          relative
          z-10
          mx-auto
          w-full
          max-w-[1360px]

          px-[18px]

          sm:px-[28px]

          lg:px-[34px]

          xl:px-[46px]
        "
      >
        {/* HEADER */}

        <motion.div
          initial={{
            opacity: 0,
            y: 30,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.35,
          }}
          transition={{
            duration: 0.95,
            ease,
          }}
          className="
            flex
            w-full
            flex-col
            items-center
            justify-center
            text-center
          "
        >
          <span
            className="
              inline-flex
              rounded-[4px]
              bg-[#F1F7FF]
              px-[8px]
              py-[4px]
              font-secondary
              text-[10px]
              font-medium
              leading-none
              text-[#0075FF]

              sm:text-[11px]
            "
          >
            History
          </span>

          <h2
            className="
              mx-auto
              mt-[12px]
              block
              w-full
              max-w-[640px]
              text-center
              font-primary
              text-[29px]
              font-semibold
              leading-[1.08]
              tracking-[-0.8px]
              !text-[#111111]

              sm:text-[36px]

              xl:text-[44px]
            "
          >
            Our Legacy Through the Years
          </h2>

          <p
            className="
              mx-auto
              mt-[11px]
              block
              w-full
              max-w-[620px]
              text-center
              font-secondary
              text-[12.5px]
              leading-[1.6]
              text-[#777777]

              sm:text-[15px] pt-3
            "
          >
            Milestones that shaped the journey, growth and spirit of Rosary.
          </p>
        </motion.div>

        {/* TIMELINE */}

        <div
          className="
            relative
            mt-[38px]

            sm:mt-[50px]

            xl:mt-[64px]
          "
        >
          {/* DESKTOP CENTER LINE */}

          <div
            className="
              absolute
              bottom-0
              left-1/2
              top-0
              hidden
              w-[2px]
              -translate-x-1/2
              bg-[#1E1E1E]/55

              xl:block
            "
          />

          <motion.div
            style={{
              height: timelineFill,
            }}
            className="
              absolute
              left-1/2
              top-0
              hidden
              w-[2px]
              -translate-x-1/2
              bg-[#0075FF]

              xl:block
            "
          />

          {/* MOBILE/TABLET LEFT LINE */}

          <div
            className="
              absolute
              bottom-0
              left-[15px]
              top-0
              w-px
              bg-[#202020]/20

              xl:hidden
            "
          />

          <motion.div
            style={{
              height: timelineFill,
            }}
            className="
              absolute
              left-[15px]
              top-0
              w-px
              bg-[#0075FF]

              xl:hidden
            "
          />

          {/* ITEMS */}

          <div
            className="
              flex
              flex-col
              gap-[44px]

              sm:gap-[54px]

              xl:gap-[42px]
            "
          >
            {timelineItems.map(
              (item, index) => (
                <div key={item.id}>
                  <CompactTimelineRow
                    item={item}
                    index={index}
                  />

                  <DesktopTimelineRow
                    item={item}
                    index={index}
                  />
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
}