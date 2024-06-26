'use client';
import Lottie from 'lottie-react';

type LottiePlayerProps = {
  JSON: any;
  classes?: string;
};

export function LottieAnimationPlayer(props: LottiePlayerProps) {
  return (
    <Lottie
      className={props.classes}
      animationData={props.JSON}
      loop={false}
      autoplay={true}
    />
  );
}
