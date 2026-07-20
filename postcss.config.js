// @carneirofc/ui/styles.css (imported by globals.css) ships external
// @font-face rules for Sora / IBM Plex Mono pointing at fonts.gstatic.com —
// a fallback for consumers who don't self-host. This site already
// self-hosts both families via next/font (see site-shell.tsx), so those
// external rules are pure dead weight: same family name, later in the
// cascade, so the browser fetches gstatic.com instead of using the
// preloaded self-hosted files. Strip them post-Tailwind so only the
// self-hosted @font-face rules remain.
function stripExternalGoogleFonts() {
  return {
    postcssPlugin: "strip-external-google-fonts",
    AtRule: {
      "font-face"(rule) {
        rule.walkDecls("src", (decl) => {
          if (decl.value.includes("fonts.gstatic.com")) rule.remove();
        });
      },
    },
  };
}
stripExternalGoogleFonts.postcss = true;

module.exports = {
  plugins: ["@tailwindcss/postcss", stripExternalGoogleFonts],
};
