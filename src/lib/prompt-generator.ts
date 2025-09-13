import type { Compass, ContentPillar, ContentType, Platform, PostType } from './types';
import { contentTypes, platformPostTypes } from './data';

export function generateDynamicPrompt(
  content: string,
  selectedContentType: ContentType | undefined,
  selectedPillar: ContentPillar | undefined,
  platform: Platform | undefined,
  selectedPostTypeId: string | undefined,
  postFields: { [key: string]: any },
  compass: Compass | undefined
): string {
  if (!platform || !selectedContentType || !selectedPillar) {
    return "";
  }

  const channelStrategy = compass?.channelStrategies?.find(cs => cs.platform === platform);
  const postType = platformPostTypes[platform]?.find(pt => pt.id === selectedPostTypeId);

  let dynamicFieldsPrompt = '';
  if (postType && postFields) {
    const fieldsDetails = postType.fields.map(field => {
      const value = postFields[field.id];
      if (value) {
        return `- ${field.name}: "${value}"`;
      }
      return null;
    }).filter(Boolean).join('\n');

    if (fieldsDetails) {
      dynamicFieldsPrompt = `
## تفاصيل نوع المنشور
${fieldsDetails}
`;
    }
  }

  const prompt = `
# الدور (Role)
أنت خبير استراتيجي في صناعة المحتوى لوسائل التواصل الاجتماعي ومتخصص في الكتابة الإعلانية الإبداعية.

# السياق الاستراتيجي الشامل (Overall Strategic Context)
هذا هو السياق الكامل لاستراتيجية المحتوى التي أعمل عليها. استخدمه كمرجع أساسي في فهم أهدافي وجمهوري.
- الهدف الاستراتيجي العام: "${compass?.goals?.objective || 'غير محدد'}"
- الجمهور المستهدف الأساسي: "${compass?.personas?.map(p => p.name).join(', ') || 'غير محدد'}"
- شخصية العلامة التجارية: "${'غير محدد'}"
- نبرة الصوت: "${compass?.tone?.description || 'غير محدد'}"
- ✅ كلمات نستخدمها: "${compass?.tone?.dos?.join(', ') || 'لا يوجد'}"
- ❌ كلمات نتجنبها: "${compass?.tone?.donts?.join(', ') || 'لا يوجد'}"

# المهمة (Task)
مهمتك هي تحويل الفكرة الأولية التالية إلى مسودة منشور احترافية وجاهزة للنشر، مع تخصيصها بشكل دقيق للمنصة المحددة أدناه.

# تفاصيل المنشور المطلوب (Post Details)
## الفكرة الأولية
- المحتوى الخام: "${content}"
- الهدف من هذا المنشور: "${contentTypes.find(ct => ct.value === selectedContentType)?.label || 'غير محدد'}"
- يندرج تحت محور المحتوى: "${selectedPillar?.name || 'غير محدد'}"
- وصف المحور: "${selectedPillar?.description || 'غير محدد'}"

## المنصة المستهدفة (Target Platform)
- المنصة: **${platform || 'غير محدد'}**
- الهدف من استخدامنا لهذه المنصة: "${channelStrategy?.strategicGoal || 'غير محدد'}"
- نوع المنشور المطلوب: "${postType?.name || 'غير محدد'}"
${dynamicFieldsPrompt}
# التعليمات والمخرجات المطلوبة (Instructions & Output)
1.  قم بصياغة محتوى المنشور ليتوافق تماماً مع شخصية ونبرة صوت علامتنا التجارية.
2.  تأكد من أن المحتوى يخدم الهدف المحدد للمنصة والهدف العام للمنشور.
3.  إذا كان نوع المنشور "نصي"، فقدم نصاً جذاباً. إذا كان "صورة" أو "فيديو"، فاقترح نصاً مرافقاً (Caption) قوياً ووصفاً للفكرة المرئية.
4.  قدم المخرج كنص نهائي وجاهز للنسخ بدون أي شروحات أو مقدمات إضافية.
  `;
  return prompt.trim();
}
