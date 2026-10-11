(() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  const classicalPool = [
    { name: "清和", source: "南朝·谢灵运《游赤石进帆海》", line: "首夏犹清和，芳草亦未歇。", style: "elegant", gender: "neutral", tags: ["清润", "平和"] },
    { name: "景明", source: "宋·范仲淹《岳阳楼记》", line: "至若春和景明，波澜不惊。", style: "bright", gender: "neutral", tags: ["明朗", "开阔"] },
    { name: "望舒", source: "战国·屈原《离骚》", line: "前望舒使先驱兮，后飞廉使奔属。", style: "elegant", gender: "female", tags: ["清逸", "月意"] },
    { name: "若华", source: "战国·屈原《天问》", line: "羲和之未扬，若华何光？", style: "elegant", gender: "female", tags: ["温柔", "光华"] },
    { name: "怀瑾", source: "战国·屈原《九章》", line: "怀瑾握瑜兮，穷不得所示。", style: "calm", gender: "neutral", tags: ["端正", "守真"] },
    { name: "兰芷", source: "宋·范仲淹《岳阳楼记》", line: "岸芷汀兰，郁郁青青。", style: "elegant", gender: "female", tags: ["清芬", "雅正"] },
    { name: "星河", source: "宋·李清照《渔家傲》", line: "天接云涛连晓雾，星河欲转千帆舞。", style: "bright", gender: "neutral", tags: ["辽阔", "灵动"] },
    { name: "嘉树", source: "战国·屈原《九歌》", line: "后皇嘉树，橘徕服兮。", style: "bright", gender: "male", tags: ["端朗", "有根"] },
    { name: "云舒", source: "明·洪应明《菜根谭》", line: "去留无意，漫随天外云卷云舒。", style: "calm", gender: "neutral", tags: ["从容", "疏朗"] },
    { name: "知微", source: "《易经·系辞》意蕴", line: "见微知著，守静以观其变。", style: "calm", gender: "neutral", tags: ["通透", "细察"] },
    { name: "昭明", source: "《尚书·尧典》", line: "百姓昭明，协和万邦。", style: "bright", gender: "male", tags: ["光明", "正直"] },
    { name: "清越", source: "宋·苏轼《石钟山记》意象", line: "声如洪钟，清越而长。", style: "calm", gender: "neutral", tags: ["清朗", "有声"] },
    { name: "和光", source: "《道德经》", line: "和其光，同其尘。", style: "calm", gender: "neutral", tags: ["和厚", "含光"] },
    { name: "修竹", source: "王羲之《兰亭集序》意象", line: "此地有崇山峻岭，茂林修竹。", style: "calm", gender: "male", tags: ["清正", "坚韧"] },
    { name: "云帆", source: "唐·李白《行路难》", line: "直挂云帆济沧海。", style: "bright", gender: "male", tags: ["远志", "进取"] },
    { name: "静姝", source: "《诗经·邶风·静女》", line: "静女其姝，俟我于城隅。", style: "elegant", gender: "female", tags: ["娴静", "美好"] }
  ];

  // 扩展古典知识库：每条记录保留出处、原句、气质与适用倾向，便于生成后继续斟酌。
  const expandedClassicalPool = [
    ["月白", "宋词意象", "月白风清，如水之夜。", "elegant", "neutral", "清逸,澄澈"],
    ["令仪", "《诗经·小雅》", "岂弟君子，莫不令仪。", "elegant", "female", "端庄,雅正"],
    ["其琛", "《诗经·鲁颂》", "来献其琛，明德惟馨。", "calm", "male", "珍重,厚德"],
    ["维桢", "《诗经·大雅》", "王国克生，维周之桢。", "calm", "male", "坚贞,担当"],
    ["斯年", "《诗经·大雅》", "于万斯年，受天之祜。", "calm", "neutral", "长久,安稳"],
    ["舒窈", "《诗经·陈风》", "月出皎兮，佼人僚兮。", "elegant", "female", "舒展,婉约"],
    ["婉如", "《诗经·野有蔓草》", "有美一人，婉如清扬。", "elegant", "female", "柔和,清秀"],
    ["之恒", "《诗经·小雅》", "如月之恒，如日之升。", "bright", "male", "恒定,向上"],
    ["景行", "《诗经·小雅》", "高山仰止，景行行止。", "calm", "male", "光明,笃行"],
    ["思齐", "《论语》引《诗经》", "见贤思齐焉，见不贤而内自省也。", "calm", "neutral", "自省,向善"],
    ["明哲", "《诗经·大雅》", "既明且哲，以保其身。", "bright", "male", "明达,睿智"],
    ["既明", "《诗经·大雅》", "既明且哲，以保其身。", "bright", "neutral", "清明,通达"],
    ["修远", "战国·屈原《离骚》", "路漫漫其修远兮，吾将上下而求索。", "bright", "male", "远志,求索"],
    ["云旗", "战国·屈原《离骚》", "驾八龙之婉婉兮，载云旗之委蛇。", "bright", "male", "高远,旷达"],
    ["诚勇", "战国·屈原《九歌》", "诚既勇兮又以武，终刚强兮不可凌。", "bright", "male", "诚笃,勇毅"],
    ["怀信", "战国·屈原《九章》", "怀信侘傺，忽乎吾将行兮。", "calm", "neutral", "守信,正直"],
    ["嘉言", "《尚书·大禹谟》", "乃言底可绩，禹曰俞哉。", "elegant", "neutral", "善言,文雅"],
    ["辰良", "战国·屈原《九歌》", "吉日兮辰良，穆将愉兮上皇。", "bright", "neutral", "良辰,和美"],
    ["琼琚", "《诗经·卫风》", "投我以木瓜，报之以琼琚。", "elegant", "female", "珍美,知礼"],
    ["昭质", "战国·屈原《离骚》", "芳与泽其杂糅兮，唯昭质其犹未亏。", "calm", "neutral", "清正,本真"],
    ["江离", "战国·屈原《离骚》", "扈江离与辟芷兮，纫秋兰以为佩。", "elegant", "female", "清芬,灵秀"],
    ["杜若", "战国·屈原《九歌》", "采芳洲兮杜若，将以遗兮下女。", "elegant", "female", "芳洁,温柔"],
    ["木兰", "战国·屈原《离骚》", "朝搴阰之木兰兮，夕揽洲之宿莽。", "bright", "female", "坚韧,清芬"],
    ["湘君", "战国·屈原《九歌》", "望夫君兮未来，吹参差兮谁思。", "calm", "neutral", "清远,深情"],
    ["清扬", "《诗经·野有蔓草》", "有美一人，清扬婉兮。", "elegant", "female", "清秀,明丽"],
    ["静好", "《诗经·女曰鸡鸣》", "琴瑟在御，莫不静好。", "calm", "female", "安静,和美"],
    ["琴瑟", "《诗经·女曰鸡鸣》", "琴瑟在御，莫不静好。", "elegant", "neutral", "和谐,雅乐"],
    ["德音", "《诗经·郑风》", "彼其之子，美无度；美无度，殊异乎公路。", "calm", "neutral", "德厚,有声"],
    ["南乔", "《诗经·汉广》", "南有乔木，不可休思。", "bright", "female", "高洁,生长"],
    ["乔木", "《诗经·汉广》", "南有乔木，不可休思。", "bright", "male", "挺拔,有根"],
    ["朝雨", "唐·王维《渭城曲》", "渭城朝雨浥轻尘，客舍青青柳色新。", "elegant", "neutral", "清新,润泽"],
    ["霁月", "宋·黄庭坚《濂溪诗序》", "胸次洒落，如光风霁月。", "elegant", "neutral", "开朗,清明"],
    ["疏影", "宋·林逋《山园小梅》", "疏影横斜水清浅，暗香浮动月黄昏。", "elegant", "female", "清幽,含蓄"],
    ["暮云", "宋·秦观《八六子》", "自在飞花轻似梦，无边丝雨细如愁。", "calm", "neutral", "深静,柔和"],
    ["澄怀", "宗炳《画山水序》", "澄怀观道，卧以游之。", "calm", "neutral", "澄明,观照"],
    ["观澜", "《孟子·尽心上》", "观水有术，必观其澜。", "bright", "male", "见识,宏阔"],
    ["松间", "唐·王维《鸟鸣涧》意象", "月出惊山鸟，时鸣春涧中。", "calm", "neutral", "清幽,坚贞"],
    ["竹心", "唐·白居易《池上竹下作》意象", "水能性淡为吾友，竹解心虚即我师。", "calm", "neutral", "虚心,清正"],
    ["鹤鸣", "《诗经·小雅》", "鹤鸣于九皋，声闻于野。", "bright", "male", "高洁,远声"],
    ["鹤归", "宋·苏轼《放鹤亭记》意象", "归来兮，西山不可以久留。", "calm", "neutral", "洒脱,归真"],
    ["砚秋", "古典文房意象", "砚池涵秋水，落笔见清心。", "calm", "neutral", "文雅,沉静"],
    ["听澜", "古典山水意象", "静听松风，坐看云起。", "calm", "female", "从容,灵动"],
    ["浮舟", "唐·李白《江上吟》意象", "木兰之枻沙棠舟，玉箫金管坐两头。", "bright", "male", "自在,远行"],
    ["轻舟", "宋·李清照《武陵春》意象", "只恐双溪舴艋舟，载不动许多愁。", "elegant", "female", "轻盈,通透"],
    ["星言", "《诗经·定之方中》", "星言夙驾，说于桑田。", "bright", "neutral", "守时,明快"],
    ["星野", "古典星象意象", "星垂平野阔，月涌大江流。", "bright", "neutral", "辽阔,自由"],
    ["予安", "古典安怀意象", "愿得一心人，白首不相离。", "calm", "neutral", "安宁,温厚"],
    ["安歌", "战国·屈原《九歌》", "扬枹兮拊鼓，疏缓节兮安歌。", "elegant", "female", "安和,雅乐"],
    ["乐康", "战国·屈原《九歌》", "五音纷兮繁会，君欣欣兮乐康。", "bright", "neutral", "喜乐,健康"],
    ["乐君", "《诗经·小雅》", "乐只君子，福履绥之。", "bright", "male", "喜乐,君子"],
    ["容与", "战国·屈原《离骚》", "路曼曼其修远兮，吾将上下而求索。", "calm", "female", "从容,舒展"],
    ["维夏", "《诗经·小雅》", "四月维夏，六月徂暑。", "bright", "neutral", "明盛,生机"],
    ["惟清", "《尚书·舜典》", "夙夜惟寅，直哉惟清。", "calm", "neutral", "清正,勤谨"],
    ["以宁", "《诗经·小雅》", "济济多士，文王以宁。", "calm", "neutral", "安定,文雅"],
    ["见贤", "《论语·里仁》", "见贤思齐焉，见不贤而内自省也。", "calm", "male", "向善,自省"],
    ["怀玉", "《老子》意蕴", "被褐怀玉。", "calm", "neutral", "内秀,珍重"],
    ["玉成", "《诗经》意蕴", "玉在山而草木润，渊生珠而崖不枯。", "calm", "neutral", "成全,温润"],
    ["砺行", "古典修身意蕴", "砥砺名节，慎终如始。", "bright", "male", "自律,笃行"],
    ["明德", "《大学》", "大学之道，在明明德。", "bright", "male", "明德,正直"],
    ["嘉瑞", "祥瑞古典意象", "嘉祥屡降，瑞气盈门。", "bright", "neutral", "美善,祥瑞"],
    ["瑞安", "祥瑞古典意象", "祥云瑞气，安和自得。", "calm", "neutral", "祥和,安稳"],
    ["宸羽", "古典宫阙与鸿羽意象", "鸿鹄高飞，一举千里。", "bright", "male", "高远,进取"],
    ["映秋", "唐诗秋景意象", "一轮秋影转金波，飞镜又重磨。", "elegant", "female", "明净,成熟"],
    ["知许", "宋·陆游诗意", "从今若许闲乘月，拄杖无时夜叩门。", "calm", "neutral", "知心,从容"],
    ["知言", "《孟子·公孙丑上》", "我知言，我善养吾浩然之气。", "calm", "neutral", "明辨,正气"],
    ["言蹊", "《史记·李将军列传》", "桃李不言，下自成蹊。", "elegant", "neutral", "谦和,有成"],
    ["君谦", "《易经·谦卦》", "谦谦君子，用涉大川。", "calm", "male", "谦逊,有度"],
    ["君逸", "魏晋风骨意象", "逸气凌云，清谈自得。", "bright", "male", "洒脱,俊逸"],
    ["君昊", "《诗经·小雅》意象", "昊天曰明，及尔出王。", "bright", "male", "广阔,明朗"],
    ["逸兴", "唐·王勃《滕王阁序》", "遥襟甫畅，逸兴遄飞。", "bright", "male", "高兴,文采"],
    ["长风", "唐·李白《行路难》", "长风破浪会有时，直挂云帆济沧海。", "bright", "male", "进取,开阔"],
    ["凌云", "唐·李白《宣州谢朓楼饯别校书叔云》", "俱怀逸兴壮思飞，欲上青天揽明月。", "bright", "male", "高志,凌厉"],
    ["清川", "唐·王维《归嵩山作》", "清川带长薄，车马去闲闲。", "calm", "neutral", "清远,闲雅"],
    ["清如", "宋·朱熹《观书有感》", "问渠那得清如许，为有源头活水来。", "elegant", "female", "澄澈,灵秀"],
    ["远山", "唐·王维《画》意象", "远看山有色，近听水无声。", "calm", "neutral", "沉静,深远"],
    ["江月", "唐·张若虚《春江花月夜》", "春江潮水连海平，海上明月共潮生。", "elegant", "neutral", "清华,辽阔"],
    ["临风", "晋·陶渊明《饮酒》意象", "此中有真意，欲辨已忘言。", "bright", "neutral", "洒落,自在"],
    ["承宇", "战国·屈原《九章》", "霰雪纷其无垠兮，云霏霏而承宇。", "calm", "male", "担当,宽厚"],
    ["承泽", "古典恩泽意象", "承天之祐，泽及后人。", "calm", "male", "承继,厚德"],
    ["语汐", "古典潮汐意象", "潮来有信，月满如期。", "elegant", "female", "灵动,温柔"],
    ["书瑶", "古典文玉意象", "怀瑾握瑜，书香自远。", "elegant", "female", "文雅,珍美"],
    ["星阑", "古典星河意象", "星河欲转，漏声将阑。", "calm", "female", "深静,清丽"],
    ["青云", "唐·王勃《滕王阁序》", "穷且益坚，不坠青云之志。", "bright", "male", "志向,清正"]
  ].map(([name, source, line, style, gender, tags]) => ({ name, source, line, style, gender, tags: tags.split(",") }));

  const elementPool = {
    木: [
      { name: "桐安", meaning: "桐木有坚贞之意，安字取安定从容。", style: "calm", tags: ["生发", "安稳"] },
      { name: "芷宁", meaning: "芷为香草，宁为安宁，气质清正柔和。", style: "elegant", tags: ["清雅", "宁静"] },
      { name: "梓言", meaning: "梓有成长与故土之意，言代表诚笃有信。", style: "elegant", tags: ["成长", "守信"] },
      { name: "松远", meaning: "松有坚韧长青之象，远寓眼界与志向。", style: "bright", tags: ["坚韧", "远志"] },
      { name: "榆清", meaning: "榆取木气与厚实，清取清明自持。", style: "calm", tags: ["厚重", "清明"] }
    ],
    火: [
      { name: "昕然", meaning: "昕为黎明初光，然有明朗自然之意。", style: "bright", tags: ["晨光", "明快"] },
      { name: "景熙", meaning: "景为光景与敬意，熙为和乐兴盛。", style: "bright", tags: ["光明", "和乐"] },
      { name: "昱安", meaning: "昱为日光照耀，安让明亮之气落于安稳。", style: "bright", tags: ["光耀", "安定"] },
      { name: "昭宁", meaning: "昭为清楚明白，宁为沉静有定。", style: "calm", tags: ["清正", "沉着"] },
      { name: "煜辰", meaning: "煜有照耀之意，辰含时序与星辰之象。", style: "bright", tags: ["照耀", "星意"] }
    ],
    土: [
      { name: "安辰", meaning: "安取稳重安宁，辰象征时运与持守。", style: "calm", tags: ["稳重", "时运"] },
      { name: "坤宁", meaning: "坤有厚载之德，宁有安定平和之意。", style: "calm", tags: ["厚德", "平和"] },
      { name: "宛岑", meaning: "宛为温婉含蓄，岑有山意与静定之气。", style: "elegant", tags: ["温润", "静定"] },
      { name: "培安", meaning: "培为培植积累，安为不急不躁、根基稳固。", style: "calm", tags: ["积累", "根基"] },
      { name: "允衡", meaning: "允为诚允，衡为持平有度，整体端正可靠。", style: "elegant", tags: ["诚信", "有度"] }
    ],
    金: [
      { name: "钰安", meaning: "钰为珍宝，安让锐气归于沉稳与从容。", style: "elegant", tags: ["珍贵", "安稳"] },
      { name: "铭谦", meaning: "铭为铭记与笃定，谦为谦和自守。", style: "calm", tags: ["笃定", "谦和"] },
      { name: "锦言", meaning: "锦有美好华彩，言代表真诚有信。", style: "bright", tags: ["华美", "守信"] },
      { name: "铮然", meaning: "铮有清越之声，然代表坦荡自然。", style: "bright", tags: ["清正", "坦荡"] },
      { name: "书钧", meaning: "书取学养与文脉，钧有平衡与分寸。", style: "elegant", tags: ["学养", "持平"] }
    ],
    水: [
      { name: "沐言", meaning: "沐有润泽与新生之意，言为诚实有信。", style: "elegant", tags: ["润泽", "真诚"] },
      { name: "泽安", meaning: "泽为恩泽广被，安为安然自得。", style: "calm", tags: ["宽厚", "从容"] },
      { name: "沛然", meaning: "沛有充盛丰沛之象，然使气质舒展自然。", style: "bright", tags: ["丰盈", "舒展"] },
      { name: "清和", meaning: "清为澄澈自持，和为温和有度，气质平衡。", style: "elegant", tags: ["清润", "和雅"] },
      { name: "潇宁", meaning: "潇有洒脱灵动之意，宁让灵气落地安定。", style: "calm", tags: ["洒脱", "宁静"] }
    ]
  };

  // 五行字库扩展：每一行都保留寓意、气质和适用方向，和古典出处库混合排序。
  const expandedElementPool = {
    木: [
      ["竹清", "竹有虚心守节之意，清取澄明自持。", "calm", "清正,坚韧"], ["霁林", "霁是雨后初晴，林有生发与根基。", "elegant", "清新,生长"], ["棠溪", "海棠取温润之美，溪水寓灵动通达。", "elegant", "温柔,灵秀"], ["芳洲", "芳草与洲渚相连，取清芬与开阔。", "elegant", "清芬,自在"], ["芊语", "芊为草木繁盛，语有温和善意。", "elegant", "生机,亲和"], ["楚宁", "楚有清秀端正之象，宁取安定从容。", "calm", "清秀,安宁"], ["荣安", "荣为草木荣盛，安为根基安稳。", "bright", "兴盛,安稳"], ["森屿", "森有厚重生机，屿象征独立而有依。", "calm", "丰茂,坚定"], ["乔宁", "乔木高挺，宁字收束为平和有度。", "calm", "高远,平和"], ["桦清", "桦有挺拔之姿，清有清朗之德。", "elegant", "挺拔,清朗"]
    ].map(([name, meaning, style, tags]) => ({ name, meaning, style, tags: tags.split(",") })),
    火: [
      ["晨曜", "晨为初阳，曜为光耀，取明朗有生机。", "bright", "朝气,光明"], ["曜宁", "曜有照临之意，宁使光明归于沉着。", "calm", "明亮,安定"], ["昭辰", "昭为明白正直，辰含星时与进程。", "bright", "清正,时运"], ["晗意", "晗为天将明，意代表心志与温度。", "elegant", "希望,真诚"], ["晨熙", "晨光与熙和相合，气质温暖开朗。", "bright", "温暖,和乐"], ["烨宁", "烨为火光盛明，宁使气势沉稳有定。", "calm", "光耀,沉着"], ["映川", "映为光影相照，川有流动与开阔。", "bright", "明净,通达"], ["炜然", "炜为光彩，然取自然坦荡。", "bright", "光彩,坦荡"], ["明昶", "明为清明，昶为舒展通达、日久长明。", "bright", "通透,长久"], ["昕妍", "昕为黎明初光，妍取美好明丽。", "elegant", "初光,秀美"]
    ].map(([name, meaning, style, tags]) => ({ name, meaning, style, tags: tags.split(",") })),
    土: [
      ["岩松", "岩为山石坚实，松为长青不改。", "calm", "坚定,长青"], ["岩安", "岩有厚重之基，安有安居与从容。", "calm", "稳重,安定"], ["峻宁", "峻为高山与原则，宁取内心安定。", "calm", "端正,沉着"], ["砚川", "砚承文脉，川使厚重之中有流动。", "elegant", "文雅,通达"], ["墨安", "墨取学养与深度，安取平和自持。", "calm", "学养,安稳"], ["砚舟", "砚为沉静文心，舟寓行远与自立。", "bright", "文心,远行"], ["容川", "容为宽厚包容，川为胸襟开阔。", "calm", "宽和,开阔"], ["均泽", "均取平衡有度，泽取恩惠润泽。", "calm", "平衡,厚德"], ["维安", "维有守持与担当，安有稳妥与从容。", "calm", "担当,稳妥"], ["宥辰", "宥为宽仁，辰为时序与成长。", "elegant", "宽厚,有序"]
    ].map(([name, meaning, style, tags]) => ({ name, meaning, style, tags: tags.split(",") })),
    金: [
      ["锐安", "锐取判断与进取，安让锋芒有分寸。", "bright", "果断,稳重"], ["铎言", "铎为声名与警醒，言为诚信有信。", "elegant", "明辨,守信"], ["皓钧", "皓为明净，钧为平衡公允。", "calm", "清明,有度"], ["朗铮", "朗为开阔明亮，铮为清正有声。", "bright", "明朗,坚定"], ["钧泽", "钧有持平之德，泽有润物之恩。", "calm", "持平,厚重"], ["锦川", "锦为华彩，川为道路与胸襟。", "bright", "华美,开阔"], ["铠宁", "铠有守护与担当，宁取沉着安定。", "calm", "守护,坚毅"], ["锐宁", "锐意进取，宁字调和为稳健。", "calm", "进取,沉着"], ["书铠", "书为学养文脉，铠为责任与守护。", "elegant", "学养,担当"], ["靖言", "靖为安定正直，言为诚恳有信。", "calm", "正直,诚笃"]
    ].map(([name, meaning, style, tags]) => ({ name, meaning, style, tags: tags.split(",") })),
    水: [
      ["洛川", "洛水有文脉与灵秀，川取通达开阔。", "elegant", "文雅,通达"], ["江宁", "江有远流与胸襟，宁使气质安定。", "calm", "开阔,安宁"], ["汀兰", "汀洲兰芷，取清芬与温柔。", "elegant", "清雅,芳洁"], ["沧海", "沧海有深广之象，寓胸怀与远志。", "bright", "深远,宏阔"], ["浥尘", "浥为润泽，尘取谦和入世。", "calm", "润泽,谦和"], ["漪宁", "漪为水面细纹，宁为静定从容。", "elegant", "灵动,宁静"], ["清澜", "清为澄澈，澜为胸中有波而不失定力。", "bright", "清明,有势"], ["涵之", "涵为包容涵养，之字使名字舒展雅正。", "elegant", "涵养,文雅"], ["泠然", "泠为清越之水，然取自然坦荡。", "elegant", "清越,自在"], ["漫宁", "漫有舒缓从容之意，宁为安定有守。", "calm", "从容,安稳"]
    ].map(([name, meaning, style, tags]) => ({ name, meaning, style, tags: tags.split(",") }))
  };
  Object.entries(expandedElementPool).forEach(([element, items]) => { elementPool[element].push(...items.map(item => ({ ...item, baseElement: element }))); });

  const characterElements = {
    清: "水", 和: "土", 景: "火", 明: "火", 望: "水", 舒: "木", 若: "木", 华: "水", 怀: "水", 瑾: "火", 兰: "木", 芷: "木", 星: "火", 河: "水", 嘉: "木", 树: "木", 云: "水", 知: "火", 微: "水", 昭: "火", 越: "金", 桐: "木", 安: "土", 宁: "火", 梓: "木", 言: "金", 松: "木", 远: "土", 榆: "木", 昕: "火", 然: "金", 熙: "火", 昱: "火", 煜: "火", 辰: "土", 坤: "土", 宛: "土", 岑: "土", 培: "土", 允: "土", 衡: "土", 钰: "金", 铭: "金", 谦: "木", 锦: "金", 铮: "金", 书: "金", 钧: "金", 沐: "水", 泽: "水", 沛: "水", 潇: "水", 修: "金", 竹: "木", 帆: "水", 静: "金", 姝: "金", 光: "火"
  };
  const extraElementGroups = {
    木: "月令仪斯舒窈婉如恒齐瑶兰江离杜若木湘清扬南乔棠溪芳洲芊楚荣森屿乔桦德音言蹊青林",
    火: "白昭质辰良朝霁明澄曜昭晗晨熙烨映炜昶妍朗",
    土: "其琛维桢年怀玉玉成砺容岩峻砚墨均宥维",
    金: "琼琚铎皓朗靖铠锐钧瑶知砺书",
    水: "月河江云澜澄溪湘汐沧海浥漪涵泠漫洛汀"
  };
  Object.entries(extraElementGroups).forEach(([element, chars]) => [...chars].forEach(char => { if (!characterElements[char]) characterElements[char] = element; }));
  const characterStrokes = {
    李: 7, 王: 4, 张: 11, 刘: 15, 陈: 16, 杨: 13, 赵: 14, 黄: 12, 周: 8, 吴: 7, 徐: 10, 孙: 10, 胡: 11, 朱: 6, 高: 10, 林: 8, 何: 7, 郭: 15, 马: 10, 罗: 20, 梁: 11, 宋: 7, 郑: 19, 谢: 17, 韩: 17, 唐: 10, 冯: 12, 于: 3, 董: 15, 萧: 19, 苏: 22, 程: 12, 曹: 11, 袁: 10, 邓: 19,
    清: 11, 和: 8, 景: 12, 明: 8, 望: 11, 舒: 12, 若: 8, 华: 14, 怀: 20, 瑾: 16, 兰: 23, 芷: 10, 星: 9, 河: 9, 嘉: 14, 树: 16, 云: 12, 知: 8, 微: 13, 昭: 9, 越: 12, 桐: 10, 安: 6, 宁: 14, 梓: 11, 言: 7, 松: 8, 远: 17, 榆: 13, 昕: 8, 然: 12, 熙: 13, 昱: 9, 煜: 13, 辰: 7, 坤: 8, 宛: 8, 岑: 7, 培: 11, 允: 4, 衡: 16, 钰: 13, 铭: 14, 谦: 17, 锦: 16, 铮: 16, 书: 10, 钧: 12, 沐: 8, 泽: 17, 沛: 8, 潇: 20, 修: 10, 竹: 6, 帆: 6, 静: 16, 姝: 9, 光: 6
  };

  // 字义组合库：单字先按五行、气质、寓意和常用笔画标注，再组合为更大的候选空间。
  // 组合结果仍会经过五格、三才、五行喜用和气质方向排序，不是随机拼字。
  const nameCharacterLibrary = [
    ["安", "土", "calm", "安定从容", 6], ["宁", "火", "calm", "宁静有守", 14], ["和", "土", "elegant", "和厚有度", 8], ["清", "水", "elegant", "清明澄澈", 11], ["昭", "火", "bright", "光明正直", 9], ["明", "火", "bright", "明达通透", 8], ["景", "火", "bright", "光景开阔", 12], ["昕", "火", "bright", "黎明初光", 8], ["昱", "火", "bright", "日光照耀", 9], ["熙", "火", "bright", "和乐兴盛", 13], ["晨", "火", "bright", "清晨生机", 11], ["朗", "金", "bright", "明朗坦荡", 10], ["嘉", "木", "elegant", "美善嘉许", 14], ["佳", "木", "elegant", "美好端正", 8], ["芷", "木", "elegant", "香草清芬", 10], ["兰", "木", "elegant", "幽芳雅正", 23], ["若", "木", "elegant", "温柔自若", 8], ["瑶", "火", "elegant", "美玉珍贵", 15], ["书", "金", "elegant", "学养文脉", 10], ["言", "金", "calm", "诚笃有信", 7], ["知", "火", "calm", "明辨知微", 8], ["远", "土", "bright", "远志开阔", 17], ["修", "金", "calm", "修身笃行", 10], ["允", "土", "calm", "诚允守信", 4], ["亦", "土", "elegant", "从容自持", 6], ["予", "土", "elegant", "温厚给予", 4], ["宸", "土", "calm", "深厚端正", 10], ["宇", "土", "bright", "胸怀广宇", 6], ["承", "金", "calm", "承继担当", 8], ["泽", "水", "calm", "恩泽润物", 17], ["沐", "水", "elegant", "润泽新生", 8], ["澄", "水", "calm", "澄明沉静", 16], ["洛", "水", "elegant", "文脉灵秀", 10], ["江", "水", "bright", "长流开阔", 7], ["川", "水", "bright", "通达舒展", 3], ["澜", "水", "bright", "胸有波澜", 21], ["松", "木", "calm", "坚韧长青", 8], ["桐", "木", "elegant", "高洁有根", 10], ["竹", "木", "calm", "虚心守节", 6], ["岩", "土", "calm", "坚定厚重", 8], ["峻", "土", "bright", "高峻有原则", 10], ["衡", "土", "calm", "持平有度", 16], ["钧", "金", "calm", "平衡公允", 12], ["锦", "金", "bright", "华彩美好", 16], ["谦", "木", "calm", "谦和自守", 17], ["逸", "土", "bright", "洒脱俊逸", 15], ["砚", "土", "elegant", "文心沉静", 12], ["容", "土", "calm", "宽厚包容", 10], ["妍", "水", "elegant", "秀美明丽", 9], ["汐", "水", "elegant", "潮汐有信", 7], ["涵", "水", "calm", "涵养包容", 12], ["语", "木", "elegant", "温和善言", 14], ["依", "土", "elegant", "温柔有依", 8], ["恬", "火", "calm", "恬静安然", 10], ["舒", "木", "elegant", "舒展从容", 12], ["微", "水", "calm", "细察通透", 13]
  ].map(([char, element, style, meaning, strokes]) => ({ char, element, style, meaning, strokes }));
  Object.assign(characterElements, Object.fromEntries(nameCharacterLibrary.map(item => [item.char, item.element])));
  Object.assign(characterStrokes, Object.fromEntries(nameCharacterLibrary.map(item => [item.char, item.strokes])));
  const generatedNamePool = nameCharacterLibrary.flatMap(first => nameCharacterLibrary.map(second => {
    if (first.char === second.char) return null;
    return {
      name: first.char + second.char,
      source: "国风字义组合库",
      line: `${first.meaning}，${second.meaning}。`,
      meaning: `${first.char}字取${first.meaning}，${second.char}字取${second.meaning}`,
      style: first.style === second.style ? first.style : "elegant",
      gender: "neutral",
      tags: [first.element, second.element, first.style === second.style ? "气质协调" : "气质相济"],
      generated: true
    };
  })).filter(Boolean);
  const auspicious81 = new Set([1, 3, 5, 6, 7, 8, 11, 13, 15, 16, 17, 18, 21, 23, 24, 25, 29, 31, 32, 33, 35, 37, 39, 41, 45, 47, 48, 52, 57, 61, 63, 65, 67, 68, 71, 73, 75, 81]);
  const generating = { 木: "火", 火: "土", 土: "金", 金: "水", 水: "木" };
  const controlling = { 木: "土", 火: "金", 土: "水", 金: "木", 水: "火" };
  const escapeText = value => String(value ?? "").replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[char]));
  const elementOf = char => characterElements[char] || "土";
  const strokeOf = char => characterStrokes[char] || 8;
  const number81 = total => ((Math.abs(total) - 1) % 81) + 1;
  const elementForNumber = number => ({ 1: "木", 2: "木", 3: "火", 4: "火", 5: "土", 6: "土", 7: "金", 8: "金", 9: "水", 0: "水" }[number % 10] || "土");

  function namingBasis(birthday, gender, fallback) {
    const sex = gender === "female" ? "女" : "男";
    if (birthday && typeof window.__getBaziElementUse === "function") {
      const use = window.__getBaziElementUse(birthday, "12:00", sex, "solar");
      if (use?.preferred?.length) return { preferred: use.preferred, text: `按出生日期推演，喜用${use.preferred.join("、")}` };
    }
    return { preferred: fallback ? [fallback] : [], text: fallback ? `按${fallback}行偏好筛选` : "未指定喜用五行，按综合规则排序" };
  }

  function fiveGrids(surname, given) {
    const surnameChars = [...surname];
    const givenChars = [...given];
    const surnameTotal = surnameChars.reduce((sum, char) => sum + strokeOf(char), 0);
    const givenTotal = givenChars.reduce((sum, char) => sum + strokeOf(char), 0);
    const tian = surnameChars.length === 1 ? surnameTotal + 1 : surnameTotal;
    const ren = strokeOf(surnameChars[surnameChars.length - 1] || "姓") + strokeOf(givenChars[0] || "名");
    const di = givenTotal + (givenChars.length === 1 ? 1 : 0);
    const wai = givenChars.length === 1 ? 2 + strokeOf(surnameChars[0] || "姓") : strokeOf(surnameChars[0] || "姓") + strokeOf(givenChars[givenChars.length - 1] || "名");
    const total = surnameTotal + givenTotal;
    return { tian: number81(tian), ren: number81(ren), di: number81(di), wai: number81(wai), total: number81(total) };
  }

  function gridScore(number) { return auspicious81.has(number) ? 94 : 62; }
  function threeTalentScore(grids) {
    const talents = [elementForNumber(grids.tian), elementForNumber(grids.ren), elementForNumber(grids.di)];
    let score = 68;
    if (talents[0] === talents[1]) score += 9;
    if (talents[1] === talents[2]) score += 9;
    if (generating[talents[0]] === talents[1] || generating[talents[1]] === talents[2]) score += 8;
    if (controlling[talents[0]] === talents[1] || controlling[talents[1]] === talents[2]) score -= 12;
    return { talents, score: Math.max(45, Math.min(96, score)) };
  }

  function enrichName(item, surname, preferred, gender, style) {
    const given = item.name.slice(surname.length);
    const elements = [...given].map(elementOf);
    const grids = fiveGrids(surname, given);
    const gridAverage = [grids.tian, grids.ren, grids.di, grids.wai, grids.total].reduce((sum, value) => sum + gridScore(value), 0) / 5;
    const three = threeTalentScore(grids);
    const matched = preferred.length ? elements.filter(element => preferred.includes(element)).length : 0;
    const supported = preferred.length && elements.some(element => preferred.some(target => element === target || generating[element] === target));
    const conflicting = preferred.length && elements.some(element => preferred.some(target => controlling[element] === target));
    const styleMatch = style && item.style === style;
    const fiveElementScore = preferred.length ? (matched * 16 + (supported ? 8 : 0) - (conflicting ? 8 : 0) + 60) : 78;
    const meaningScore = styleMatch ? 96 : style ? 76 : 84;
    let score = Math.round(gridAverage * 0.34 + three.score * 0.16 + fiveElementScore * 0.28 + meaningScore * 0.22);
    if (gender === "male" && item.gender === "female") score -= 4;
    if (gender === "female" && item.gender === "male") score -= 4;
    score = Math.max(55, Math.min(98, score));
    const gridText = auspicious81.has(grids.total) ? "总格偏吉" : "总格平和";
    const elementText = elements.join("·");
    const preferenceText = preferred.length ? `喜用${preferred.join("、")}${supported ? "有生扶" : "待调和"}` : "五行不指定";
    return {
      ...item,
      score,
      elements,
      grids,
      strokes: [...surname, ...given].reduce((sum, char) => sum + strokeOf(char), 0),
      tags: [...new Set([...preferred.filter(element => elements.includes(element)), elementText, gridText, ...item.tags])],
      ruleText: `五格${grids.tian}/${grids.ren}/${grids.di}/${grids.wai}/${grids.total} · 三才${three.talents.join("·")} · ${gridText}`,
      meaning: `${item.meaning || "取字寓意清正"} ${preferenceText}，结合字义、音韵与数理综合排序。`
    };
  }

  function allPool() {
    const elementItems = Object.entries(elementPool).flatMap(([element, items]) => items.map(item => ({ ...item, baseElement: element })));
    const seen = new Set();
    return [...classicalPool, ...expandedClassicalPool, ...elementItems, ...generatedNamePool].filter(item => {
      if (seen.has(item.name)) return false;
      seen.add(item.name);
      return true;
    });
  }

  function buildCandidates({ surname, gender, preferred, style, batch }) {
    const pool = allPool().filter(item => gender === "neutral" || item.gender === "neutral" || item.gender === gender);
    const enriched = pool.map(item => enrichName({ ...item, name: surname + item.name }, surname, preferred, gender, style));
    enriched.sort((a, b) => b.score - a.score || a.name.localeCompare(b.name, "zh-CN"));
    // 每批严格取连续的10个位置，批次之间不会因步长不足而重叠。
    const start = batch * 10;
    if (start >= enriched.length) return [];
    return enriched.slice(start, start + 10);
  }

  function candidateCard(item, index) {
    const source = item.source ? `<small class="naming-source">${escapeText(item.source)}</small><p>${escapeText(item.line)}</p>` : `<p>${escapeText(item.meaning)}</p>`;
    return `<article class="naming-result-card"><div class="naming-score-badge"><strong>${item.score}</strong><small>分</small></div><div class="naming-result-main"><span class="naming-number">${String(index + 1).padStart(2, "0")}</span><div><strong>${escapeText(item.name)}</strong><div class="naming-tags">${item.tags.slice(0, 4).map(tag => `<span>${escapeText(tag)}</span>`).join("")}</div></div></div><div class="naming-result-copy">${source}<small class="naming-rule">${escapeText(item.ruleText)}</small></div></article>`;
  }

  function renderResults(items, title) {
    $("#naming-result-title").textContent = `${title} · ${items.length}个候选`;
    $("#naming-result-count").textContent = `${items.length} 个候选`;
    $("#naming-result-list").innerHTML = items.map(candidateCard).join("");
  }

  function bind() {
    const form = $("#unified-name-form");
    let state = null;
    const generate = () => {
      const surname = $("#naming-surname").value.trim();
      if (!surname) {
        $("#naming-result-title").textContent = "先输入姓氏";
        $("#naming-result-count").textContent = "0 个候选";
        $("#naming-result-list").innerHTML = `<div class="naming-empty"><span>名</span><p>输入姓氏后，结合古典出处与五行喜用生成名字。</p></div>`;
        $("#naming-refresh").disabled = true;
        return;
      }
      const gender = $("#naming-gender").value;
      const style = $("#naming-style").value;
      const chosenElement = $("#naming-element").value;
      const birthday = $("#naming-birthday").value;
      const basis = namingBasis(birthday, gender, chosenElement);
      state = { surname, gender, style, preferred: basis.preferred, basisText: basis.text, batch: state?.batch || 0 };
      renderResults(buildCandidates(state), basis.preferred.length ? `${surname} · 喜用${basis.preferred.join("、")}` : `${surname} · 综合参考`);
      $("#naming-refresh").disabled = false;
    };
    form?.addEventListener("submit", event => { event.preventDefault(); state = { ...(state || {}), batch: 0 }; generate(); });
    $("#naming-refresh")?.addEventListener("click", () => { if (!state) return; state.batch += 1; renderResults(buildCandidates(state), state.preferred.length ? `${state.surname} · 喜用${state.preferred.join("、")}` : `${state.surname} · 综合参考`); });

  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", bind); else bind();
})();
