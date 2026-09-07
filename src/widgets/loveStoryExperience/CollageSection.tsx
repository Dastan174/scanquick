import type { CollageInstance } from '@/shared/lib/loveStoryContent';
import { getCollageTemplate } from '@/shared/lib/collageTemplates';
import scss from './collageSection.module.scss';

export default function CollageSection({ instance }: { instance: CollageInstance | undefined }) {
  const template = getCollageTemplate(instance?.templateId);

  return (
    <div className={scss.wrap} style={{ aspectRatio: `${template.canvasWidth} / ${template.canvasHeight}` }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={template.background} alt="" className={scss.background} />
      {template.slots.map((slot) => {
        const photo = instance?.photos[slot.id];
        return (
          <div
            key={slot.id}
            className={scss.slot}
            style={{
              left: `${slot.x}%`,
              top: `${slot.y}%`,
              width: `${slot.width}%`,
              height: `${slot.height}%`,
              transform: `rotate(${slot.rotate ?? 0}deg)`,
            }}
          >
            {photo?.url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={photo.url}
                alt=""
                className={scss.photo}
                style={{
                  objectPosition: `${photo.x}% ${photo.y}%`,
                  transform: `scale(${photo.scale})`,
                  transformOrigin: `${photo.x}% ${photo.y}%`,
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
