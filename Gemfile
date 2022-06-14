source "https://rubygems.org"

gem 'jekyll', '~> 4.2.2'

group :jekyll_plugins do
    gem "jekyll-remote-theme"
    #gem "jekyll-feed"
    gem "jekyll-webp"
    gem "jemoji"
    gem "jekyll-paginate"
    gem "jekyll-redirect-from"
    gem "jekyll-seo-tag"
    gem "jekyll-archives"
    gem "jekyll-sitemap"
end

group :test do
  gem "html-proofer", "~> 3.18"
end

# Windows and JRuby does not include zoneinfo files, so bundle the tzinfo-data gem
# and associated library.
install_if -> { RUBY_PLATFORM =~ %r!mingw|mswin|java! } do
  gem "tzinfo"
  gem "tzinfo-data"
end

# Performance-booster for watching directories on Windows
gem "wdm", "~> 0.1.1", :install_if => Gem.win_platform?

# Jekyll <= 4.2.0 compatibility with Ruby 3.0
gem "webrick", "~> 1.7"
