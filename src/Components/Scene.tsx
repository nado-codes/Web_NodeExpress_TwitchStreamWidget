import React, { useEffect, useState } from "react";

export const Scene: React.FC<Props> = ({
  children,
  duration = 0,
  onFinish = () => null,
}: Props) => {
  const _children = children ?? <></>;
  const childScenes = Array.isArray(children)
    ? children.filter(({ type }) => type === Scene)
    : [];
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const { type: CurrentScene } = childScenes[currentSceneIndex] ?? {};

  useEffect(() => {
    console.log("[Scene]: Hello!");
    console.log(`[Scene]: I have ${childScenes.length} child scenes`);

    onFinish();
  }, []);

  useEffect(() => {
    console.log("CurrentScene=", CurrentScene);

    // .. if there are no more child scenes, finish the scene after a set duration
    if (!CurrentScene) {
      console.log(
        `A scene has no more child scenes, finishing in ${
          duration / 1000
        } seconds`
      );
      setTimeout(onFinish, duration);
    }
  }, [CurrentScene]);

  // .. render one scene at a time until all scenes are finished
  // .. if this scene contains no child scenes, just render the children
  return (
    <>
      {CurrentScene ? (
        <CurrentScene
          onFinish={() => setCurrentSceneIndex(currentSceneIndex + 1)}
        />
      ) : (
        _children
      )}
    </>
  );
};

interface Props {
  children?: React.ReactElement | React.ReactElement[];
  duration?: number;
  onFinish?: () => void;
}

/* 
    // .. get a list of contained scenes
  


return (
    <>
      {CurrentScene ? (
        <CurrentScene
          customProp={"customValue"}
          onFinish={() => setCurrentSceneIndex(currentSceneIndex + 1)}
        />
      ) : (
        { children }
      )}
    </>
  ); */
