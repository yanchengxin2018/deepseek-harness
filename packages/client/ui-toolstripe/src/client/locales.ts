/**
 * `toolstripe` namespace dictionaries: the far-left tool stripe, the left
 * tool dock chrome, and the project file-tree panel.
 */

/** Simplified Chinese dictionary (the key-set source of truth). */
export const zh = {
  'tool.tasks': '任务',
  'tool.project': '项目',
  'tool.commit': '提交',
  'tool.git': 'Git',
  'tool.terminal': '终端',
  'tool.tasks.aria': '切换任务侧栏',
  'tool.project.aria': '切换项目面板',
  'tool.commit.aria': '提交窗口（即将可用）',
  'tool.git.aria': 'Git 窗口（即将可用）',
  'tool.terminal.aria': '打开终端',
  'panel.project.title': '项目',
  'panel.close': '关闭面板',
  'project.empty.noSession': '打开一个会话后，即可浏览其工作区文件。',
  'project.loading': '正在加载…',
  'project.truncated': '目录条目过多，仅显示部分。',
  'project.listFailed': '无法读取目录。',
  'commit.unavailable': '提交窗口即将可用。',
  'git.unavailable': 'Git 窗口即将可用。',
} satisfies Record<string, string>

/** The toolstripe namespace key union. */
export type ToolstripeKey = keyof typeof zh

/** English dictionary, checked complete against the zh key set. */
export const en = {
  'tool.tasks': 'Tasks',
  'tool.project': 'Project',
  'tool.commit': 'Commit',
  'tool.git': 'Git',
  'tool.terminal': 'Terminal',
  'tool.tasks.aria': 'Toggle the tasks sidebar',
  'tool.project.aria': 'Toggle the project panel',
  'tool.commit.aria': 'Commit tool window (coming soon)',
  'tool.git.aria': 'Git tool window (coming soon)',
  'tool.terminal.aria': 'Open the terminal',
  'panel.project.title': 'Project',
  'panel.close': 'Close panel',
  'project.empty.noSession': 'Open a session to browse its workspace files.',
  'project.loading': 'Loading…',
  'project.truncated': 'This directory has more entries than shown.',
  'project.listFailed': 'The directory could not be read.',
  'commit.unavailable': 'The Commit tool window is coming soon.',
  'git.unavailable': 'The Git tool window is coming soon.',
} satisfies Record<ToolstripeKey, string>

/** Japanese dictionary, checked against the English keys. */
export const ja = {
  'tool.tasks': 'タスク',
  'tool.project': 'プロジェクト',
  'tool.commit': 'コミット',
  'tool.git': 'Git',
  'tool.terminal': 'ターミナル',
  'tool.tasks.aria': 'タスクサイドバーを切り替え',
  'tool.project.aria': 'プロジェクトパネルを切り替え',
  'tool.commit.aria': 'コミットツールウィンドウ（近日公開）',
  'tool.git.aria': 'Gitツールウィンドウ（近日公開）',
  'tool.terminal.aria': 'ターミナルを開く',
  'panel.project.title': 'プロジェクト',
  'panel.close': 'パネルを閉じる',
  'project.empty.noSession': 'セッションを開くと、そのワークスペースのファイルを閲覧できます。',
  'project.loading': '読み込み中…',
  'project.truncated': 'エントリが多いため、一部のみ表示しています。',
  'project.listFailed': 'ディレクトリを読み取れませんでした。',
  'commit.unavailable': 'コミットツールウィンドウは近日公開です。',
  'git.unavailable': 'Gitツールウィンドウは近日公開です。',
} satisfies Record<keyof typeof en, string>

/** Spanish dictionary, checked against the English keys. */
export const es = {
  'tool.tasks': 'Tareas',
  'tool.project': 'Proyecto',
  'tool.commit': 'Confirmar',
  'tool.git': 'Git',
  'tool.terminal': 'Terminal',
  'tool.tasks.aria': 'Alternar la barra de tareas',
  'tool.project.aria': 'Alternar el panel de proyecto',
  'tool.commit.aria': 'Ventana de confirmación (próximamente)',
  'tool.git.aria': 'Ventana de Git (próximamente)',
  'tool.terminal.aria': 'Abrir la terminal',
  'panel.project.title': 'Proyecto',
  'panel.close': 'Cerrar panel',
  'project.empty.noSession': 'Abra una sesión para explorar los archivos de su espacio de trabajo.',
  'project.loading': 'Cargando…',
  'project.truncated': 'Este directorio tiene más entradas de las que se muestran.',
  'project.listFailed': 'No se pudo leer el directorio.',
  'commit.unavailable': 'La ventana de confirmación estará disponible pronto.',
  'git.unavailable': 'La ventana de Git estará disponible pronto.',
} satisfies Record<keyof typeof en, string>

/** French dictionary, checked against the English keys. */
export const fr = {
  'tool.tasks': 'Tâches',
  'tool.project': 'Projet',
  'tool.commit': 'Commit',
  'tool.git': 'Git',
  'tool.terminal': 'Terminal',
  'tool.tasks.aria': 'Basculer la barre des tâches',
  'tool.project.aria': 'Basculer le panneau Projet',
  'tool.commit.aria': 'Fenêtre de commit (bientôt disponible)',
  'tool.git.aria': 'Fenêtre Git (bientôt disponible)',
  'tool.terminal.aria': 'Ouvrir le terminal',
  'panel.project.title': 'Projet',
  'panel.close': 'Fermer le panneau',
  'project.empty.noSession': 'Ouvrez une session pour parcourir ses fichiers de espace de travail.',
  'project.loading': 'Chargement…',
  'project.truncated': 'Ce répertoire contient plus d’entrées que affichées.',
  'project.listFailed': 'Impossible de lire le répertoire.',
  'commit.unavailable': 'La fenêtre de commit arrive bientôt.',
  'git.unavailable': 'La fenêtre Git arrive bientôt.',
} satisfies Record<keyof typeof en, string>

/** German dictionary, checked against the English keys. */
export const de = {
  'tool.tasks': 'Aufgaben',
  'tool.project': 'Projekt',
  'tool.commit': 'Committen',
  'tool.git': 'Git',
  'tool.terminal': 'Terminal',
  'tool.tasks.aria': 'Aufgabenleiste umschalten',
  'tool.project.aria': 'Projektpanel umschalten',
  'tool.commit.aria': 'Commit-Fenster (demnächst)',
  'tool.git.aria': 'Git-Fenster (demnächst)',
  'tool.terminal.aria': 'Terminal öffnen',
  'panel.project.title': 'Projekt',
  'panel.close': 'Panel schließen',
  'project.empty.noSession': 'Öffnen Sie eine Sitzung, um ihre Arbeitsbereichsdateien zu durchsuchen.',
  'project.loading': 'Wird geladen…',
  'project.truncated': 'Dieses Verzeichnis hat mehr Einträge als angezeigt.',
  'project.listFailed': 'Das Verzeichnis konnte nicht gelesen werden.',
  'commit.unavailable': 'Das Commit-Fenster kommt bald.',
  'git.unavailable': 'Das Git-Fenster kommt bald.',
} satisfies Record<keyof typeof en, string>

/** Russian dictionary, checked against the English keys. */
export const ru = {
  'tool.tasks': 'Задачи',
  'tool.project': 'Проект',
  'tool.commit': 'Коммит',
  'tool.git': 'Git',
  'tool.terminal': 'Терминал',
  'tool.tasks.aria': 'Переключить боковую панель задач',
  'tool.project.aria': 'Переключить панель проекта',
  'tool.commit.aria': 'Окно коммита (скоро)',
  'tool.git.aria': 'Окно Git (скоро)',
  'tool.terminal.aria': 'Открыть терминал',
  'panel.project.title': 'Проект',
  'panel.close': 'Закрыть панель',
  'project.empty.noSession': 'Откройте сеанс, чтобы просмотреть файлы его рабочей области.',
  'project.loading': 'Загрузка…',
  'project.truncated': 'В этом каталоге больше записей, чем показано.',
  'project.listFailed': 'Не удалось прочитать каталог.',
  'commit.unavailable': 'Окно коммита появится скоро.',
  'git.unavailable': 'Окно Git появится скоро.',
} satisfies Record<keyof typeof en, string>

/** Portuguese dictionary, checked against the English keys. */
export const pt = {
  'tool.tasks': 'Tarefas',
  'tool.project': 'Projeto',
  'tool.commit': 'Commit',
  'tool.git': 'Git',
  'tool.terminal': 'Terminal',
  'tool.tasks.aria': 'Alternar a barra de tarefas',
  'tool.project.aria': 'Alternar o painel de projeto',
  'tool.commit.aria': 'Janela de commit (em breve)',
  'tool.git.aria': 'Janela do Git (em breve)',
  'tool.terminal.aria': 'Abrir o terminal',
  'panel.project.title': 'Projeto',
  'panel.close': 'Fechar painel',
  'project.empty.noSession': 'Abra uma sessão para navegar pelos arquivos do espaço de trabalho.',
  'project.loading': 'Carregando…',
  'project.truncated': 'Este diretório tem mais entradas do que as exibidas.',
  'project.listFailed': 'Não foi possível ler o diretório.',
  'commit.unavailable': 'A janela de commit chega em breve.',
  'git.unavailable': 'A janela do Git chega em breve.',
} satisfies Record<keyof typeof en, string>
