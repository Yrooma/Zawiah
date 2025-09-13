import { ContentType, Platform, PostType } from './types';

export const contentTypes: {
  value: ContentType;
  label: string;
  icon: string;
  color: string;
}[] = [
  {
    value: 'educational',
    label: 'تعليمي',
    icon: '🎓',
    color: 'text-blue-500',
  },
  {
    value: 'entertainment',
    label: 'ترفيهي',
    icon: '🎉',
    color: 'text-pink-500',
  },
  {
    value: 'inspirational',
    label: 'ملهم',
    icon: '✨',
    color: 'text-yellow-500',
  },
  {
    value: 'interactive',
    label: 'تفاعلي',
    icon: '💬',
    color: 'text-green-500',
  },
  {
    value: 'promotional',
    label: 'ترويجي',
    icon: '💰',
    color: 'text-purple-500',
  },
];

export const platformPostTypes: Record<Platform, PostType[]> = {
  x: [
    {
      id: 'x-text',
      name: 'منشور نصي (Tweet)',
      description: 'تغريدة نصية قياسية.',
      fields: [
        { id: 'text', name: 'نص التغريدة', type: 'textarea', placeholder: 'ماذا يحدث؟' },
      ],
      strategicNote: 'مثالي للأخبار العاجلة، طرح الأسئلة، الأفكار السريعة.',
    },
    {
      id: 'x-media',
      name: 'منشور صورة/فيديو',
      description: 'تغريدة تحتوي على وسائط مرئية.',
      fields: [
        { id: 'text', name: 'نص التغريدة', type: 'textarea', placeholder: 'أضف تعليقاً...' },
        { id: 'altText', name: 'وصف الصورة/الفيديو (Alt Text)', type: 'text', placeholder: 'وصف للمحتوى المرئي...' },
      ],
      systemReminder: '⚠️ جهّز الصورة/الفيديو لإرفاقه عند النشر',
    },
    {
      id: 'x-poll',
      name: 'استطلاع رأي (Poll)',
      description: 'سؤال تفاعلي مع خيارات تصويت.',
      fields: [
        { id: 'question', name: 'السؤال', type: 'text', placeholder: 'اطرح سؤالاً...' },
        { id: 'option1', name: 'خيار 1', type: 'text', placeholder: 'خيار 1' },
        { id: 'option2', name: 'خيار 2', type: 'text', placeholder: 'خيار 2' },
        { id: 'option3', name: 'خيار 3 (اختياري)', type: 'text', placeholder: 'خيار 3' },
        { id: 'option4', name: 'خيار 4 (اختياري)', type: 'text', placeholder: 'خيار 4' },
      ],
      strategicNote: 'ممتاز لزيادة التفاعل وجمع آراء الجمهور بسرعة.',
    },
  ],
  facebook: [
    {
      id: 'facebook-text',
      name: 'منشور نصي (Status)',
      description: 'تحديث حالة نصي طويل.',
      fields: [
        { id: 'text', name: 'نص المنشور', type: 'textarea', placeholder: 'بم تفكر؟' },
      ],
      strategicNote: 'مناسب لمشاركة الأخبار، القصص، والتحديثات التي تتطلب تفصيلاً.',
    },
    {
      id: 'facebook-media',
      name: 'منشور صورة/فيديو/كاروسيل',
      description: 'منشور مرئي.',
      fields: [
        { id: 'text', name: 'نص المنشور', type: 'textarea', placeholder: 'قل شيئاً عن هذه الصورة...' },
        { id: 'altText', name: 'وصف الوسائط', type: 'text', placeholder: 'وصف للمحتوى المرئي...' },
      ],
      systemReminder: '⚠️ جهّز الصور/الفيديو لإرفاقها عند النشر',
    },
    {
      id: 'facebook-poll',
      name: 'استطلاع رأي (Poll)',
      description: 'سؤال تفاعلي.',
      fields: [
        { id: 'question', name: 'السؤال', type: 'text', placeholder: 'اطرح سؤالاً...' },
        { id: 'options', name: 'الخيارات', type: 'options', placeholder: 'أضف خيارات...' },
      ],
    },
  ],
  linkedin: [
    {
      id: 'linkedin-text',
      name: 'منشور نصي (Text Post)',
      description: 'منشور نصي احترافي طويل.',
      fields: [
        { id: 'text', name: 'نص المنشور', type: 'textarea', placeholder: 'ابدأ منشوراً...' },
      ],
      strategicNote: 'الأقوى لمشاركة الخبرات، الرؤى المهنية، وبدء نقاشات جادة.',
    },
    {
      id: 'linkedin-media',
      name: 'منشور صورة/فيديو',
      description: 'منشور مرئي لزيادة الجاذبية.',
      fields: [
        { id: 'text', name: 'نص المنشور', type: 'textarea', placeholder: 'أضف تعليقاً...' },
        { id: 'altText', name: 'وصف الصورة (Alt Text)', type: 'text', placeholder: 'وصف للمحتوى المرئي...' },
      ],
      systemReminder: '⚠️ جهّز الصورة/الفيديو لإرفاقه عند النشر',
    },
    {
      id: 'linkedin-document',
      name: 'منشور مستند (Document Post)',
      description: 'مشاركة ملف PDF أو عرض تقديمي ككاروسيل تفاعلي.',
      fields: [
        { id: 'title', name: 'عنوان المستند', type: 'text', placeholder: 'أضف عنواناً للمستند...' },
        { id: 'text', name: 'النص المرافق للمنشور', type: 'textarea', placeholder: 'أضف وصفاً...' },
      ],
      systemReminder: '⚠️ جهّز ملف الـPDF/PPT لإرفاقه عند النشر',
      strategicNote: 'الأفضل للمحتوى التعليمي العميق، دراسات الحالة، والتقارير.',
    },
    {
      id: 'linkedin-poll',
      name: 'استطلاع رأي (Poll)',
      description: 'أداة تفاعل قوية في المجتمع المهني.',
      fields: [
        { id: 'question', name: 'السؤال', type: 'text', placeholder: 'ماذا تريد أن تسأل؟' },
        { id: 'option1', name: 'خيار 1', type: 'text', placeholder: 'خيار 1' },
        { id: 'option2', name: 'خيار 2', type: 'text', placeholder: 'خيار 2' },
        { id: 'option3', name: 'خيار 3 (اختياري)', type: 'text', placeholder: 'خيار 3' },
        { id: 'option4', name: 'خيار 4 (اختياري)', type: 'text', placeholder: 'خيار 4' },
      ],
    },
  ],
  threads: [
    {
      id: 'threads-text',
      name: 'منشور نصي (Thread)',
      description: 'منشور نصي يصل إلى 500 حرف.',
      fields: [
        { id: 'text', name: 'نص المنشور', type: 'textarea', placeholder: 'ابدأ ثريد...' },
      ],
      strategicNote: 'للمحادثات السريعة والمجتمعية، يشبه X ولكن بنبرة أقل رسمية.',
    },
    {
      id: 'threads-media',
      name: 'منشور صورة/فيديو',
      description: 'التركيز الأساسي للمنصة بجانب النص.',
      fields: [
        { id: 'text', name: 'نص المنشور', type: 'textarea', placeholder: 'أضف تعليقاً...' },
        { id: 'altText', name: 'وصف الوسائط', type: 'text', placeholder: 'وصف للمحتوى المرئي...' },
      ],
      systemReminder: '⚠️ جهّز الصور/الفيديو لإرفاقها عند النشر',
    },
  ],
  tiktok: [
    {
      id: 'tiktok-video',
      name: 'منشور فيديو (TikTok)',
      description: 'هو النوع الوحيد تقريباً. التركيز على المحتوى المرئي القصير.',
      fields: [
        { id: 'caption', name: 'النص المرافق/الوصف (Caption)', type: 'textarea', placeholder: 'اكتب وصفاً...' },
        { id: 'hashtags', name: 'الهاشتاجات/المواضيع', type: 'text', placeholder: '#هاشتاج...' },
      ],
      systemReminder: '⚠️ هذه المنصة تعتمد كلياً على الفيديو. استخدم الحقول لكتابة الوصف والهاشتاجات التي ستنسخها عند النشر يدوياً.',
    },
  ],
  snapchat: [
    {
      id: 'snapchat-story',
      name: 'قصة (Snapchat Story)',
      description: 'التركيز على المحتوى المرئي القصير.',
      fields: [
        { id: 'caption', name: 'النص المرافق/الوصف (Caption)', type: 'textarea', placeholder: 'اكتب وصفاً...' },
        { id: 'topics', name: 'المواضيع', type: 'text', placeholder: 'موضوع...' },
      ],
      systemReminder: '⚠️ هذه المنصة تعتمد كلياً على الفيديو/الصورة. استخدم الحقول لكتابة الوصف الذي ستنسخه عند النشر يدوياً.',
    },
  ],
  email: [
    {
      id: 'email-newsletter',
      name: 'رسالة بريدية (Newsletter)',
      description: 'رسالة بريدية ترسل إلى قائمة المشتركين.',
      fields: [
        { id: 'subject', name: 'سطر العنوان (Subject)', type: 'text', placeholder: 'عنوان البريد الإلكتروني' },
        { id: 'previewText', name: 'النص الاستباقي (Preview Text)', type: 'text', placeholder: 'نص قصير يظهر بعد العنوان' },
        { id: 'body', name: 'محتوى الرسالة (Body)', type: 'textarea', placeholder: 'اكتب رسالتك هنا...' },
      ],
      strategicNote: 'للتواصل المباشر والعميق مع الجمهور الأكثر ولاءً.',
    },
  ],
  instagram: [
      {
        id: 'instagram-post',
        name: 'منشور صورة/فيديو',
        description: 'منشور مرئي.',
        fields: [
            { id: 'text', name: 'نص المنشور', type: 'textarea', placeholder: 'اكتب تعليقاً...' },
            { id: 'altText', name: 'وصف الصورة (Alt Text)', type: 'text', placeholder: 'وصف للمحتوى المرئي...' },
        ],
        systemReminder: '⚠️ جهّز الصور/الفيديو لإرفاقها عند النشر',
      },
      {
        id: 'instagram-story',
        name: 'قصة (Story)',
        description: 'محتوى مؤقت يختفي بعد 24 ساعة.',
        fields: [
            { id: 'text', name: 'النص على القصة', type: 'textarea', placeholder: 'أضف نصاً...' },
        ],
        systemReminder: '⚠️ جهّز الصورة/الفيديو لإرفاقها عند النشر',
      },
      {
        id: 'instagram-reel',
        name: 'ريلز (Reel)',
        description: 'فيديو قصير وممتع.',
        fields: [
            { id: 'text', name: 'وصف الريل', type: 'textarea', placeholder: 'اكتب وصفاً...' },
            { id: 'hashtags', name: 'الهاشتاجات', type: 'text', placeholder: '#هاشتاج...' },
        ],
        systemReminder: '⚠️ جهّز الفيديو لإرفاقه عند النشر',
      }
  ]
};
