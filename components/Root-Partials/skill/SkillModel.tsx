type SkillModelType = {
  skill: string;
  key?: number;
};

export default function SkillModel(props: SkillModelType) {
  return (
    <div className="py-1 px-3 ml-2 mt-2 select-none cursor-pointer rounded-lg bg-ternary">
      <h1 className="text-ternary-foreground font-semibold text-md xl:sm">
        {props.skill}
      </h1>
    </div>
  );
}
