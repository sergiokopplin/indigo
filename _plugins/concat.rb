=begin
  Jekyll filter to concatenate arrays
  Usage:
    {% assign result = array-1 | concatArray: array-2 %}
=end
# filter code extracted from Jekyll 4: https://github.com/Shopify/liquid/blob/v4.0.0.rc3/lib/liquid/standardfilters.rb
module Jekyll
  module ConcatArrays

    def concat(input, array)
      unless array.respond_to?(:to_ary)
        raise ArgumentError.new("concat filter requires an array argument")
      end
      InputIterator.new(input).concat(array)
    end

   class InputIterator
      include Enumerable

      def initialize(input)
        @input = if input.is_a?(Array)
          input.flatten
        elsif input.is_a?(Hash)
          [input]
        elsif input.is_a?(Enumerable)
          input
        else
          Array(input)
        end
      end

      def concat(args)
        to_a.concat(args)
      end

      def each
        @input.each do |e|
          yield(e.respond_to?(:to_liquid) ? e.to_liquid : e)
        end
      end
    end

  end
end

Liquid::Template.register_filter(Jekyll::ConcatArrays)
