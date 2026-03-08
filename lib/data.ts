export type Standard = {
  beginner: string;
  intermediate: string;
  progression: string;
};

export type Step = {
  level: number;
  name: string;
  execution: string;
  points: string[];
  standard: Standard;
};

export type Exercise = {
  id: string;
  name: string;
  description: string;
  steps: Step[];
};

const generateGenericStandard = (level: number): Standard => {
  if (level <= 3) {
    return {
      beginner: "1组，10次",
      intermediate: "2组，15次",
      progression: "3组，30次",
    };
  } else if (level <= 6) {
    return {
      beginner: "1组，5次",
      intermediate: "2组，10次",
      progression: "2组，20次",
    };
  } else {
    return {
      beginner: "1组，3次",
      intermediate: "2组，6次",
      progression: "2组，10次",
    };
  }
};

type StepInput = {
  name: string;
  execution: string;
};

const createSteps = (inputs: StepInput[]): Step[] => {
  return inputs.map((input, index) => ({
    level: index + 1,
    name: input.name,
    execution: input.execution,
    points: [
      "保持动作缓慢、受控，感受肌肉的发力。",
      "注意呼吸：发力（推/拉/起）时呼气，还原时吸气。",
      "如果感到关节剧烈疼痛，请立即停止并退回上一式。"
    ],
    standard: generateGenericStandard(index + 1),
  }));
};

export const exercises: Exercise[] = [
  {
    id: "pushups",
    name: "俯卧撑 (Pushups)",
    description: "锻炼胸肌、三角肌前束和肱三头肌，打造强壮的上肢推力。",
    steps: createSteps([
      { name: "墙壁俯卧撑", execution: "面对墙壁站立，脚尖距墙壁约一臂远。双脚并拢，双臂伸直，与肩同宽，双手平放在墙上。弯曲肘部，直到前额轻触墙面。将自己推回起始位置。" },
      { name: "上斜俯卧撑", execution: "找一个稳固的物体（如桌子、高椅子），双手撑在边缘，与肩同宽。双脚向后退，直到身体成一直线。弯曲肘部，直到胸部轻触物体边缘，然后推回。" },
      { name: "膝盖俯卧撑", execution: "双膝跪地，双手撑地与肩同宽。身体从膝盖到头部保持一直线。下放身体直到胸部距离地面一拳距离，然后推起。" },
      { name: "半俯卧撑", execution: "采用标准俯卧撑姿势，但在身下放一个篮球或一摞砖块（约一半动作幅度的高度）。下放身体直到髋部触碰物体，然后推起。" },
      { name: "标准俯卧撑", execution: "双手撑地与肩同宽，双脚并拢。身体挺直。下放身体直到胸部距离地面一拳距离，然后推起。" },
      { name: "窄距俯卧撑", execution: "姿势同标准俯卧撑，但双手食指和拇指相触，形成一个三角形。下放身体直到胸部触碰手背。" },
      { name: "偏重俯卧撑", execution: "采用标准俯卧撑姿势，但一只手放在篮球或砖块上。下放身体直到胸部距离地面一拳距离。" },
      { name: "单手半俯卧撑", execution: "单手撑地，双脚分开以保持平衡。在身下放一个篮球。下放身体直到髋部触碰篮球，然后推起。" },
      { name: "杠杆俯卧撑", execution: "单手撑地，另一只手向外侧伸直，放在篮球上。下放身体直到胸部距离地面一拳距离。" },
      { name: "单手俯卧撑", execution: "单手撑地，双脚分开。下放身体直到下巴距离地面一拳距离，然后推起。" },
    ]),
  },
  {
    id: "squats",
    name: "深蹲 (Squats)",
    description: "锻炼股四头肌、臀大肌、腘绳肌和小腿，打造强壮的下肢。",
    steps: createSteps([
      { name: "肩倒立深蹲", execution: "仰卧，双腿并拢抬起，双手支撑下背部，身体倒立。弯曲膝盖，直到膝盖轻触前额，然后伸直双腿。" },
      { name: "折刀深蹲", execution: "站立，双脚与肩同宽，弯腰双手触地（或抓住稳固的家具）。弯曲膝盖下蹲，直到大腿后侧碰到小腿，然后利用手臂辅助站起。" },
      { name: "支撑深蹲", execution: "站立，双手抓住齐腰高的稳固物体（如桌子边缘）。下蹲直到大腿后侧碰到小腿，利用手臂辅助站起。" },
      { name: "半深蹲", execution: "站立，双脚与肩同宽。下蹲直到大腿与地面平行，然后站起。" },
      { name: "标准深蹲", execution: "站立，双脚与肩同宽。下蹲直到大腿后侧碰到小腿，然后站起。保持背部挺直。" },
      { name: "窄距深蹲", execution: "站立，双脚并拢，脚跟相触。下蹲直到大腿后侧碰到小腿，然后站起。" },
      { name: "偏重深蹲", execution: "站立，一只脚平放，另一只脚脚跟抬起，脚尖点地。下蹲直到大腿后侧碰到小腿，主要用平放的脚发力站起。" },
      { name: "单腿半深蹲", execution: "单腿站立，另一条腿向前伸直。下蹲直到站立腿的大腿与地面平行，然后站起。" },
      { name: "辅助单腿深蹲", execution: "单腿站立，另一条腿向前伸直。一手抓住旁边的稳固物体辅助。下蹲直到大腿后侧碰到小腿，借助手臂力量站起。" },
      { name: "单腿深蹲", execution: "单腿站立，另一条腿向前伸直悬空。下蹲直到大腿后侧碰到小腿，然后完全靠单腿力量站起。" },
    ]),
  },
  {
    id: "pullups",
    name: "引体向上 (Pullups)",
    description: "锻炼背阔肌、大圆肌、菱形肌和肱二头肌，打造强壮的上肢拉力。",
    steps: createSteps([
      { name: "垂直引体", execution: "找一个坚固的垂直物体（如门框），双手抓住，身体后倾。拉动身体靠近物体，然后慢慢放回。" },
      { name: "水平引体向上", execution: "找一个坚固的横杆（如桌子边缘），仰卧在下，双手抓住边缘，身体挺直。拉起身体直到胸部触碰边缘。" },
      { name: "折刀引体向上", execution: "找一个较高的横杆，双手抓住，双腿向前伸直，脚跟放在高处（如椅子上）。拉起身体直到下巴过杆。" },
      { name: "半引体向上", execution: "双手抓住单杠，身体悬空。弯曲手臂，从肘部呈90度角的位置开始，拉起身体直到下巴过杆，然后下放到90度角。" },
      { name: "标准引体向上", execution: "双手抓住单杠，身体悬空，手臂完全伸直。拉起身体直到下巴过杆，然后慢慢下放至手臂伸直。" },
      { name: "窄距引体向上", execution: "双手并拢抓住单杠。拉起身体直到下巴过杆，然后下放。" },
      { name: "偏重引体向上", execution: "双手抓住单杠，一只手正握，另一只手抓住正握那只手的手腕。拉起身体直到下巴过杆。" },
      { name: "单手半引体向上", execution: "单手抓住单杠，从肘部呈90度角的位置开始，拉起身体直到下巴过杆，下放至90度角。" },
      { name: "辅助单手引体向上", execution: "单手抓住单杠，另一只手抓住一条悬挂的毛巾辅助。拉起身体直到下巴过杆。" },
      { name: "单手引体向上", execution: "单手抓住单杠，身体悬空。拉起身体直到下巴过杆，然后慢慢下放至手臂伸直。" },
    ]),
  },
  {
    id: "legraises",
    name: "举腿 (Leg Raises)",
    description: "锻炼腹直肌、腹斜肌、前锯肌和髋屈肌，打造钢铁核心。",
    steps: createSteps([
      { name: "坐姿屈膝", execution: "坐在椅子边缘，身体稍微后倾，双手抓住边缘，双腿伸直悬空。弯曲膝盖，将大腿拉向胸部，然后伸直。" },
      { name: "平卧抬膝", execution: "仰卧，双手放在身体两侧，双腿并拢。弯曲膝盖，将大腿拉向胸部，直到大腿垂直于地面。" },
      { name: "平卧屈举腿", execution: "仰卧，双腿并拢。抬起双腿，膝盖微屈，直到双脚在骨盆正上方。" },
      { name: "平卧蛙举腿", execution: "仰卧，双腿并拢抬起。在最高点将双腿伸直，然后慢慢下放至离地一拳距离。" },
      { name: "平卧直举腿", execution: "仰卧，双腿完全伸直并拢。抬起双腿直到垂直于地面，然后慢慢下放至离地一拳距离。" },
      { name: "悬垂屈膝", execution: "双手抓住单杠，身体悬空。弯曲膝盖，将大腿抬起至与地面平行。" },
      { name: "悬垂屈举腿", execution: "悬垂状态下，抬起双腿，膝盖微屈，直到双脚达到骨盆高度。" },
      { name: "悬垂蛙举腿", execution: "悬垂状态下，抬起双腿至骨盆高度，在最高点伸直双腿，然后慢慢下放。" },
      { name: "悬垂半举腿", execution: "悬垂状态下，双腿完全伸直。抬起双腿直到与地面平行，然后下放。" },
      { name: "悬垂直举腿", execution: "悬垂状态下，双腿完全伸直。抬起双腿直到脚尖触碰单杠，然后慢慢下放。" },
    ]),
  },
  {
    id: "bridges",
    name: "桥 (Bridges)",
    description: "锻炼竖脊肌、臀部和腘绳肌，打造强壮灵活的脊柱。",
    steps: createSteps([
      { name: "短桥", execution: "仰卧，双膝弯曲，双脚平放地面，双手放在身体两侧。臀部发力，将骨盆向上抬起，直到大腿和躯干成一直线。" },
      { name: "直桥", execution: "坐在地上，双腿伸直，双手撑在臀部后方。臀部发力，将身体抬起，直到身体成一直线。" },
      { name: "高低桥", execution: "仰卧，双脚放在高处（如椅子上），双手撑在头部两侧。向上推起身体，直到手臂伸直。" },
      { name: "顶桥", execution: "仰卧，双膝弯曲，双手撑在头部两侧。向上推起身体，直到头顶轻触地面，支撑身体。" },
      { name: "半桥", execution: "找一个齐腰高的物体（如篮球），仰卧在上面，双手和双脚撑地。向上推起身体，直到手臂和双腿伸直。" },
      { name: "标准桥", execution: "仰卧，双膝弯曲，双手撑在头部两侧。向上推起身体，直到手臂和双腿完全伸直，背部呈拱形。" },
      { name: "下腰半桥", execution: "站立，背对墙壁，距离墙壁约一臂远。向后弯腰，双手撑在墙上，慢慢向下走到一半高度，然后走回。" },
      { name: "上腰半桥", execution: "站立，背对墙壁。向后弯腰，双手撑在墙上，从一半高度慢慢向下走到接近地面，然后走回一半高度。" },
      { name: "闭合桥", execution: "站立，向后弯腰，双手撑地形成标准桥。然后利用腰腹力量站起。" },
      { name: "铁板桥", execution: "站立，向后弯腰，双手撑地形成标准桥。然后双腿并拢伸直，保持背部极度拱起。" },
    ]),
  },
  {
    id: "handstandpushups",
    name: "倒立撑 (Handstand Pushups)",
    description: "锻炼三角肌、斜方肌和肱三头肌，打造强壮的肩部。",
    steps: createSteps([
      { name: "靠墙顶立", execution: "面对墙壁，双手撑地，双脚蹬墙倒立。保持身体挺直，脚跟靠墙。保持这个姿势。" },
      { name: "乌鸦式", execution: "蹲下，双手撑地，膝盖靠在肘部外侧。身体前倾，双脚离地，用双手平衡身体。" },
      { name: "靠墙倒立", execution: "面对墙壁，双手撑地，双脚蹬墙倒立。慢慢将重心转移到双手，脚尖轻触墙壁。" },
      { name: "半倒立撑", execution: "靠墙倒立，弯曲肘部，直到头部下降一半距离，然后推起。" },
      { name: "标准倒立撑", execution: "靠墙倒立，弯曲肘部，直到头顶轻触地面，然后推起。" },
      { name: "窄距倒立撑", execution: "靠墙倒立，双手食指和拇指相触。弯曲肘部，直到头顶轻触手背，然后推起。" },
      { name: "偏重倒立撑", execution: "靠墙倒立，一只手放在篮球或砖块上。弯曲肘部，直到头顶轻触地面，然后推起。" },
      { name: "单手半倒立撑", execution: "靠墙单手倒立，另一只手放在背后。弯曲肘部下降一半距离，然后推起。" },
      { name: "杠杆倒立撑", execution: "靠墙单手倒立，另一只手向外侧伸直放在篮球上。弯曲肘部直到头顶轻触地面，然后推起。" },
      { name: "单手倒立撑", execution: "靠墙单手倒立。弯曲肘部直到头顶轻触地面，然后推起。" },
    ]),
  },
];
