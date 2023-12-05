const Gmail = (email) => {
  return email
    .replace(/@ga?e?i?o?r?g?[nm]{0,2}s?[ail]{1,2}[aiklmou]{0,3}\.(?!gov|edu|ac\.in)/, "@gmail.")
    .replace(/@gmail\.(com\.\w+|c)$/, "@gmail.com");
};

const AddMissingM = (email) => {
  return email.replace(/(aol|googlemail|gmail|hotmail|yahoo).co$/, "$1.com");
};

const AddMissingPeriod = (email) => {
  return email.replace(/([^.])(com|org|net)$/, "$1.$2");
};

const Aol = (email) => {
  return email.replace(/@(ol|ao|ail)\./, "@aol.");
};

const DifferentTlds = (email) => {
  return email
    .replace(/\.(o\.uk|co\.k|couk|co\.u[kmnlj]{0,2})$/, ".co.uk")
    .replace(/\.(cojp|co\.lp|co\.p)$/, ".co.jp")
    .replace(/\.(com?br|com?\.[bv]r+)$/, ".com.br")
    .replace(/\.(r+(u+(?!n).|y)|r)$/, ".ru")
    .replace(/\.i+t+$/, ".it")
    .replace(/\.f+[re]+$/, ".fr")
    .replace(/\.de+(?!v).$/, ".de")
    .replace(/\.jn$/, ".in")
    .replace(/\.lde$/, ".de")
    .replace(/\.oprg$/, ".org")
    .replace(/\.gob(\b|\.)/, ".gov")
    .replace(/\.edi?(\b|\.)/, ".edu")
    .replace(/\.mx.{1,2}$/, ".mx")
    .replace(/\.[com.]{2,3}ar$/, ".com.ar")
    .replace(/\.[com.]{2,3}au$/, ".com.au");
};

const DotCom = (email) => {
  return email
    .replace(/\.co[mn]\.com/, ".com")
    .replace(/\.com\.$/, ".com")
    .replace(/\.com(?!cast|\.|@).{1,3}$/, ".com")
    .replace(/\.co[^op]$/, ".com")
    .replace(/\.c*(c|ck|ci|coi|l|m|n|o|op|cp|0|9)*m+o*$/, ".com")
    .replace(/\.(c|f|v|x)o+(m|n)$/, ".com");
};

const DotNet = (email) => {
  return email
    .replace(/\.(nte*|n*et*|ney)$/, ".net")
    .replace(/\.met$/, ".net");
};

const DotOrg = (email) => {
  return email.replace(/\.og?r?g{0,2}$/, ".org");
};

const FixExtraneousLetterDotCom = (email) => {
  return email.replace(/\..com$/, ".com");
};

const FixExtraneousNumbers = (email) => {
  return email.replace(/\.?\d+$/, "");
};

const Googlemail = (email) => {
  return email.replace(
    /@go{0,3}g{0,2}o?le?[mn]?[ail]{1,2}m?[aikl]{0,3}\.(?!gov|edu|ac\.in)/,
    "@googlemail."
  );
};

const Hotmail = (email) => {
  return email
    .replace(
      /@h((?!anmail)(i|o|p)?y?t?o?a?r?m?n?t?m?[aikl]{1,3}l?)\./,
      "@hotmail."
    )
    .replace(/@otmail\.com/, "@hotmail.com")
    .replace(/@hotmail.com[a-z]+/, "@hotmail.com");
};

const Icloud = (email) => {
  return email.replace(/@icl{0,2}(?:uo|u|o)?d\./, "@icloud.");
};

const KnownDotCom = (email) => {
  return email.replace(
    /@(aol|googlemail|gmail|hotmail|yahoo|icloud|outlook)\.(co|net|org)$/,
    "@$1.com"
  );
};

const PeriodAroundAtSign = (email) => {
  return email.replace(/(\.@|@\.)/, "@");
};

const Providers = (email) => {
  return email
    .replace(/@co?(m|n)a?cas?t{0,2}\./, "@comcast.")
    .replace(/@sbc?gl?ob[al]{0,2}l?\./, "@sbcglobal.")
    .replace(/@ver?i?z?on\./, "@verizon.")
    .replace(/@icl{0,2}oud\./, "@icloud.")
    .replace(/@outl?ook?\./, "@outlook.");
};

const RemoveInvalidChars = (email) => {
  return email
    .replace(/(\s|[#`'"\\|])*/, "")
    .replace(/\//g, ".")
    .replace(/(,|\.\.)/g, ".")
    .replace(/!/g, "1")
    .replace(/@@/g, "@");
};

const RemoveMailTo = (email) => {
  return email.replace(/^mailto:/i, "");
};

const TransposedPeriods = (email) => {
  return email
    .replace(/c\.om$/, ".com")
    .replace(/n\.et$/, ".net");
};

const Yahoo = (email) => {
  return email.replace(/@(ya|yh|ua|ah)+h*a*o+\./, "@yahoo.");
};

const defaultProcessors = [
  RemoveMailTo,
  RemoveInvalidChars,
  TransposedPeriods,
  PeriodAroundAtSign,
  DifferentTlds,
  FixExtraneousLetterDotCom,
  FixExtraneousNumbers,
  AddMissingM,
  AddMissingPeriod,
  Providers,
  Aol,
  DotCom,
  DotNet,
  DotOrg,
  Gmail,
  Googlemail,
  Hotmail,
  Icloud,
  KnownDotCom,
  Yahoo
];

export const correctEmailTypo = (email, processors = defaultProcessors) => {
  if (!email) {
    return null;
  }

  return processors.reduce((processedEmail, processor) => {
    return processor(processedEmail);
  }, email.toLowerCase());
};
