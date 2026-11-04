package database

import (
	"log"
	"time"

	"github.com/syuctacm/syuctacm/server/internal/model"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var DB *gorm.DB

func Init(databaseURL string) (*gorm.DB, error) {
	var db *gorm.DB
	var err error

	// Retry connecting up to 10 times with 2s interval for reboot resilience
	for i := 1; i <= 10; i++ {
		db, err = gorm.Open(postgres.Open(databaseURL), &gorm.Config{
			Logger: logger.Default.LogMode(logger.Warn),
		})
		if err == nil {
			break
		}
		log.Printf("[Database] Connecting to PostgreSQL (attempt %d/10): %v", i, err)
		time.Sleep(2 * time.Second)
	}

	if err != nil {
		log.Printf("[Database] Warning: failed to connect to PostgreSQL after retries: %v", err)
		return nil, err
	}

	sqlDB, err := db.DB()
	if err == nil {
		sqlDB.SetMaxIdleConns(10)
		sqlDB.SetMaxOpenConns(50)
		sqlDB.SetConnMaxLifetime(time.Hour)
	}

	log.Println("[Database] PostgreSQL connected successfully, running migrations...")
	if err := db.AutoMigrate(&model.User{}, &model.Article{}, &model.SiteConfig{}, &model.WikiPage{}, &model.WikiRevision{}, &model.Survey{}, &model.Question{}, &model.Submission{}, &model.Answer{}); err != nil {
		log.Printf("[Database] AutoMigrate error: %v", err)
	}

	seedInitialData(db)

	DB = db
	return db, nil
}

func seedInitialData(db *gorm.DB) {
	// 1. Seed Admin
	var adminCount int64
	db.Model(&model.User{}).Where("username = ?", "admin").Count(&adminCount)
	if adminCount == 0 {
		hash, err := bcrypt.GenerateFromPassword([]byte("admin123"), bcrypt.DefaultCost)
		if err == nil {
			admin := model.User{
				Username:     "admin",
				PasswordHash: string(hash),
				Nickname:     "集训队管理员",
				Email:        "admin@syuctacm.cn",
				Role:         "admin",
				Bio:          "SYUCT ACM 集训队主控管理账号",
			}
			if err := db.Create(&admin).Error; err == nil {
				log.Println("[Database] Initial admin created: admin / admin123")
			}
		}
	}

	// 2. Seed Initial Articles
	var articleCount int64
	db.Model(&model.Article{}).Count(&articleCount)
	if articleCount == 0 {
		articles := []model.Article{
			{
				Title:      "2026 年秋季集训队招新选拔与考核预告",
				Slug:       "2026-autumn-recruit",
				Category:   "notice",
				Summary:    "面向全校 2025/2026 级计算机类、数理类及全体程序设计爱好者，开展秋季算法集训队选拔赛。考核涵盖 C/C++ 语法基础、常见数据结构与基础算法。",
				Content:    "# 2026 年秋季集训队招新选拔与考核预告\n\n沈阳化工大学 ACM-ICPC 集训队即日起面向全校本科生开启新一轮集训队员招募！\n\n### 一、招募对象\n- 全校 2025 级、2026 级本科生，对算法竞赛、程序设计与高难度问题求解具有强烈好奇心与探索欲；\n- 具备基本的 C/C++ 编程常识，或愿意投入课余时间刻苦训练者；\n- 不限学院与专业，热爱即是最大驱动力。\n\n### 二、选拔流程\n1. **在线报名**：在本官网注册账号，填写个人意向与学号；\n2. **日常做题**：进入校内 Hydro OJ（https://oj.syuctacm.cn）完成新生专项入门题单；\n3. **上机考核**：预计于 10 月底在计算机机房举行统一上机选拔赛；\n4. **集训入队**：入选预备队，参与周末授课与寒冬集中营。\n\n> 期待你的加入，与我们一同征战 ICPC / CCPC！",
				IsPinned:   true,
				AuthorName: "集训队教练组",
			},
			{
				Title:      "沈阳化工大学 ACM 集训队在 ICPC 区域赛中斩获奖牌",
				Slug:       "icpc-regional-award-2026",
				Category:   "contest",
				Summary:    "在刚刚结束的第 50 届国际大学生程序设计竞赛 (ICPC) 区域赛中，我校代表队历经 5 小时奋战，成功解出 5 题，斩获奖牌，刷新近年来最佳战绩。",
				Content:    "# 沈阳化工大学 ACM 集训队在 ICPC 区域赛中斩获奖牌\n\n在第 50 届 ICPC 国际大学生程序设计竞赛区域赛中，由我校计算机学院学生组成的代表队沉着应战，在全国近 300 支知名高校强队的激烈角逐中脱颖而出，成功斩获奖牌！\n\n### 比赛回顾\n- 开场前 1 小时迅速封顶 2 道签到题；\n- 中期在图论与动态规划题目上遭遇卡常与边界难题，队员现场手算推演，在第 190 分钟成功 AC 关键题；\n- 最终以总罚时优势稳居奖牌榜。\n\n向所有参赛队员与指导老师致以热烈祝贺！代码筑基，算法登峰！",
				IsPinned:   true,
				AuthorName: "集训队新闻部",
			},
			{
				Title:      "薪火相传 · 13届学长赵宝奇：我的大学算法与竞赛生涯总结",
				Slug:       "senior-13-zhaobaoqi",
				Category:   "senior",
				Summary:    "回顾大学四年从零基础推开 ACM 大门，到日夜泡在实验室刷题、外出征战各大赛场的难忘经历，为学弟学妹提供学习与生涯规划参考。",
				Content:    "# 薪火相传 · 13届学长赵宝奇：大学算法与生涯总结\n\n### 为什么要写这个总结\n每个人从进入大学，到进入 ACM 队，再到后面的考研、实习与毕业，都有不同的生活与思考。希望能写下自己曾经的困惑，踩过的坑，不仅是对自己的交代，更是给未来的学弟学妹一个肩膀，让大家在前人的经验上走得更稳、更远。\n\n### 竞赛给我的收获\n1. **硬核的编码能力**：5小时上百行复杂代码一次调通的心理素质，是在其他课堂无法训练出来的；\n2. **深刻的思维习惯**：看到一个问题，本能地分析时间与空间复杂度，寻找最优解；\n3. **并肩作战的队友**：一起熬夜、一起吃泡面、一起为一道题 AC 欢呼的兄弟情谊。\n\n希望学弟学妹们保持热爱，不畏难题！",
				IsPinned:   false,
				AuthorName: "13届 赵宝奇",
			},
			{
				Title:      "薪火相传 · 14届学长陈明：算法竞赛从零到省一完整避坑指南",
				Slug:       "senior-14-chenming",
				Category:   "senior",
				Summary:    "详述算法训练中的常见误区：为什么不要盲目刷杂题？如何建立属于自己的模板库？如何进行有效的模拟赛复盘？",
				Content:    "# 薪火相传 · 14届学长陈明：算法竞赛完整避坑指南\n\n很多新人在刚入队时容易陷入几个误区：\n\n1. **误区一：只看不写**。算法伪代码看懂了不等于能 AC，边界条件和细节只有键盘敲出来才算真正掌握；\n2. **误区二：刷题不成体系**。今天做动态规划，明天做数论，结果两边都一知半解。建议按专题打穿（枚举 ➔ 贪心 ➔ 搜索 ➔ 图论 ➔ DP）；\n3. **误区三：轻视打比赛时的心态**。平时 AC 率高，比赛遇到难题就慌神。必须定期参加 Codeforces / AtCoder 实时线上赛磨砺心态。\n\n加油，坚持一年，你会发现自己脱胎换骨。",
				IsPinned:   false,
				AuthorName: "14届 陈明",
			},
			{
				Title:      "集训队内部 Hydro OJ 题库标签规范与每周训练要求",
				Slug:       "training-rules-2026",
				Category:   "notice",
				Summary:    "统一规范 Hydro OJ (oj.syuctacm.cn) 题目分类标签标准，明确正式队员与预备队员每周最低训练通过题数与打卡考核要求。",
				Content:    "# 集训队内部 Hydro OJ 题库标签规范与训练要求\n\n为保证日常训练规范化，集训队对 Hydro OJ 平台作出如下规定：\n\n### 1. 题库分类标准\n- 题目标签统一规范为细分算法名（如：模拟、贪心、二分、动态规划、图论、数论等）；\n- 每道题目关联标签不得超过 5 个；\n- 个人主页打卡日历（Activity Calendar）与标签排行榜（Tag Stat）已全面上线。\n\n### 2. 每周训练打卡\n- 预备队队员每周至少自主完成 5 道对应专题题目；\n- 正式队队员每周至少参与一次实时线上模拟赛（CF/AtCoder）并完成补题总结。\n\n请全体队员自觉遵守并保持高频训练！",
				IsPinned:   false,
				AuthorName: "集训队教务组",
			},
		}

		for _, a := range articles {
			db.Create(&a)
		}
		log.Println("[Database] Initial articles seeded successfully.")
	}

	// 3. Seed Initial Wiki Knowledge Base
	var wikiCount int64
	db.Model(&model.WikiPage{}).Count(&wikiCount)
	if wikiCount == 0 {
		wikiPages := []model.WikiPage{
			{
				Title:         "关于我们",
				GroupName:     "关于",
				CreatedBy:     "system",
				UpdatedBy:     "system",
				RevisionCount: 1,
				Content: "# 沈阳化工大学 ACM-ICPC 集训队\n\n" +
					"沈阳化工大学 ACM-ICPC 集训队（ACM @ SYUCT）是由全校程序设计与算法竞赛爱好者自发组织、" +
					"计算机科学与技术学院指导教师团队统筹指导的学术型竞技社团。\n\n" +
					"## 我们做什么\n\n" +
					"- 组织新生算法入门培训与校内选拔赛；\n" +
					"- 开展每周例行训练、模拟赛与赛后讲评；\n" +
					"- 选拔并训练队员参加 ICPC、CCPC、辽宁省赛、蓝桥杯和天梯赛；\n" +
					"- 维护校内 Hydro OJ、题目标签榜和集训队知识库。\n\n" +
					"## 我们的目标\n\n" +
					"让每一位愿意投入时间与热情的同学，都能在算法、代码与团队协作上获得扎实成长。",
			},
			{
				Title:         "集训队服务与训练平台",
				GroupName:     "服务",
				CreatedBy:     "system",
				UpdatedBy:     "system",
				RevisionCount: 1,
				Content: "# 集训队服务与训练平台\n\n" +
					"## Hydro OJ 校内评测\n\n" +
					"校内核心评测平台：https://oj.syuctacm.cn \n\n" +
					"日常训练、新生选拔、专题题单和个人训练热力图都在这里完成。\n\n" +
					"## 题目标签榜\n\n" +
					"标准化的题库算法标签分类，支持模拟、贪心、二分、动态规划、图论、数论与数据结构等专题检索。\n\n" +
					"## GitHub 组织\n\n" +
					"组织地址：https://github.com/syuctacm ，用于沉淀网站、工具与历届资料。",
			},
			{
				Title:         "日常训练与赛事日历",
				GroupName:     "训练",
				CreatedBy:     "system",
				UpdatedBy:     "system",
				RevisionCount: 1,
				Content: "# 日常训练与赛事日历\n\n" +
					"## 每周例行训练\n\n" +
					"- 周末：5 小时全真模拟赛或 Codeforces / AtCoder 线上合练；\n" +
					"- 赛后：高年级队员拆解核心题型、代码实现与常见坑点；\n" +
					"- 周中：专题题单与个人补题。\n\n" +
					"## 秋季新生选拔\n\n" +
					"每年秋季面向全校大一、大二开放，从 C/C++ 基础语法、STL 容器到基础算法思维逐步推进。\n\n" +
					"## 主要赛事\n\n" +
					"ICPC 国际大学生程序设计竞赛、CCPC 中国大学生程序设计竞赛、辽宁省大学生程序设计竞赛、蓝桥杯与天梯赛。",
			},
			{
				Title:         "薪火相传与竞赛路线",
				GroupName:     "传承",
				CreatedBy:     "system",
				UpdatedBy:     "system",
				RevisionCount: 1,
				Content: "# 薪火相传与竞赛路线\n\n" +
					"## 入门阶段\n\n" +
					"C/C++ 语法 → 复杂度分析 → 枚举与模拟 → 排序、二分与贪心。\n\n" +
					"## 进阶阶段\n\n" +
					"搜索 → 动态规划 → 图论 → 数论 → 数据结构与综合专题。\n\n" +
					"## 学长经验\n\n" +
					"历届队员的学习路线、竞赛复盘与生涯规划总结会持续整理到本知识库，欢迎后续成员继续补充。",
			},
			{
				Title:         "常见问题与修订指南",
				GroupName:     "指南",
				CreatedBy:     "system",
				UpdatedBy:     "system",
				RevisionCount: 1,
				Content: "# 常见问题与修订指南\n\n" +
					"## 如何加入集训队？\n\n" +
					"关注秋季招新通知，注册账号并完成 Hydro OJ 新生题单，参加统一上机选拔。\n\n" +
					"## 如何编辑 Wiki？\n\n" +
					"登录后即可创建或编辑页面；所有修改都会生成修订快照，可在历史记录中查看和回退。\n\n" +
					"## 如何联系我们？\n\n" +
					"官方邮箱：noreply@mail.syuctacm.cn 。",
			},
		}

		for i := range wikiPages {
			page := &wikiPages[i]
			err := db.Transaction(func(tx *gorm.DB) error {
				if err := tx.Create(page).Error; err != nil {
					return err
				}
				return tx.Create(&model.WikiRevision{
					PageID:  page.ID,
					Title:   page.Title,
					Content: page.Content,
					Editor:  "system",
				}).Error
			})
			if err != nil {
				log.Printf("[Database] Failed to seed wiki page %q: %v", page.Title, err)
			}
		}
		if len(wikiPages) > 0 {
			log.Println("[Database] Initial wiki pages seeded successfully.")
		}
	}
}
